import { readFileSync } from "node:fs";
import { resolve } from "node:path";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const acorn = require("acorn");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const acornWalk = require("acorn-walk");

const cinematicPath = resolve(
  __dirname,
  "..",
  "..",
  "public",
  "chonk-cinematic.html",
);

// This test guards the cinematic file against the class of bug that
// blew up Step 2 of the rebuild: stripping a builder function (e.g.
// buildMilkGlob) but leaving an animate-loop iterator
// (e.g. `for (const body of symbioteBodies) {...}`) behind. The
// orphan reference threw `ReferenceError: symbioteBodies is not
// defined` inside the async IIFE — the script never reached
// `animate()`, the canvas never painted, and the user saw a blank
// fade-to-black instead of a cup. By AST-walking the module and
// asserting every referenced identifier is declared (or a known
// global), this lock catches ANY future strip that leaves a
// dangling reference behind, not just symbioteBodies/powderBodies.

describe("chonk-cinematic runtime smoke (AST undefined-symbol scan)", () => {
  let moduleSrc: string;

  beforeAll(() => {
    const html = readFileSync(cinematicPath, "utf8");
    // The cinematic ships one big <script type="module"> block.
    const m = html.match(/<script type="module">([\s\S]*?)<\/script>/);
    if (!m) {
      throw new Error("could not find <script type=module> in cinematic");
    }
    moduleSrc = m[1];
  });

  it("module parses as a valid ES module (catches SyntaxError early)", () => {
    expect(() =>
      acorn.parse(moduleSrc, { ecmaVersion: 2024, sourceType: "module" }),
    ).not.toThrow();
  });

  it("every identifier referenced inside the module is also declared (catches orphan refs like symbioteBodies)", () => {
    const ast = acorn.parse(moduleSrc, {
      ecmaVersion: 2024,
      sourceType: "module",
    });

    // Build the set of every declared name across the module: imports,
    // var/let/const declarations (incl. destructure patterns), function
    // and class names, function/arrow parameters, and the implicit
    // `arguments`. This is intentionally module-wide (not block-scoped)
    // — for an undefined-symbol detector we want a permissive set so
    // false positives stay low; what we care about is the bug where
    // a name is referenced and NEVER declared anywhere in the file.
    const declared = new Set<string>(["arguments"]);

    const collectPatternNames = (pattern: unknown): void => {
      if (!pattern || typeof pattern !== "object") return;
      const node = pattern as { type: string; [k: string]: unknown };
      switch (node.type) {
        case "Identifier":
          declared.add(node.name as string);
          break;
        case "ObjectPattern":
          for (const prop of node.properties as Array<{
            type: string;
            value?: unknown;
            argument?: unknown;
          }>) {
            if (prop.type === "RestElement") collectPatternNames(prop.argument);
            else collectPatternNames(prop.value);
          }
          break;
        case "ArrayPattern":
          for (const el of node.elements as unknown[]) collectPatternNames(el);
          break;
        case "RestElement":
          collectPatternNames(node.argument);
          break;
        case "AssignmentPattern":
          collectPatternNames(node.left);
          break;
      }
    };

    acornWalk.full(ast, (node: { type: string; [k: string]: unknown }) => {
      switch (node.type) {
        case "VariableDeclarator":
          collectPatternNames(node.id);
          break;
        case "FunctionDeclaration":
        case "FunctionExpression":
        case "ArrowFunctionExpression":
          if (node.id) collectPatternNames(node.id);
          for (const p of node.params as unknown[]) collectPatternNames(p);
          break;
        case "ClassDeclaration":
        case "ClassExpression":
          if (node.id) collectPatternNames(node.id);
          break;
        case "CatchClause":
          if (node.param) collectPatternNames(node.param);
          break;
        case "ImportDeclaration":
          for (const spec of node.specifiers as Array<{
            type: string;
            local: unknown;
          }>) {
            collectPatternNames(spec.local);
          }
          break;
      }
    });

    // Known globals the module uses — JS built-ins + browser DOM/window
    // surface + THREE (imported namespace) + a handful of Web APIs.
    const globals = new Set<string>([
      // JS built-ins
      "Object",
      "Array",
      "Boolean",
      "Number",
      "String",
      "Math",
      "JSON",
      "Promise",
      "Symbol",
      "Map",
      "Set",
      "WeakMap",
      "WeakSet",
      "Date",
      "RegExp",
      "Error",
      "TypeError",
      "RangeError",
      "ReferenceError",
      "SyntaxError",
      "Float32Array",
      "Float64Array",
      "Int8Array",
      "Int16Array",
      "Int32Array",
      "Uint8Array",
      "Uint8ClampedArray",
      "Uint16Array",
      "Uint32Array",
      "ArrayBuffer",
      "DataView",
      "Infinity",
      "NaN",
      "undefined",
      "globalThis",
      "console",
      "parseInt",
      "parseFloat",
      "isFinite",
      "isNaN",
      "Reflect",
      "Proxy",
      // Browser / DOM / Web APIs the cinematic touches
      "window",
      "document",
      "performance",
      "requestAnimationFrame",
      "cancelAnimationFrame",
      "setTimeout",
      "clearTimeout",
      "setInterval",
      "clearInterval",
      "HTMLCanvasElement",
      "Image",
      "ImageData",
      "OffscreenCanvas",
      "fetch",
      "FontFace",
      "URL",
      "URLSearchParams",
      "TextEncoder",
      "TextDecoder",
      "parent",
      "self",
      "top",
      "location",
      "navigator",
      "matchMedia",
      "MouseEvent",
      "TouchEvent",
      // Three.js — imported in chonk-cinematic.html as `import * as THREE`
      "THREE",
      // The two named-imports from three/addons (parsed from import {} from)
      "RGBELoader",
      "RectAreaLightUniformsLib",
    ]);

    const referenced = new Set<string>();
    acornWalk.full(
      ast,
      (
        node: { type: string; [k: string]: unknown },
        _state: unknown,
        ancestors: Array<{ type: string; [k: string]: unknown }>,
      ) => {
        if (node.type !== "Identifier") return;
        const parent = ancestors[ancestors.length - 2];
        if (!parent) return;
        // Skip identifiers in NON-reference positions: property keys,
        // member expressions on the right side of `.`, labels, etc.
        if (
          parent.type === "MemberExpression" &&
          parent.property === node &&
          !(parent.computed as boolean)
        )
          return;
        if (parent.type === "Property" && parent.key === node) return;
        if (parent.type === "MethodDefinition" && parent.key === node) return;
        if (parent.type === "LabeledStatement" && parent.label === node) return;
        if (parent.type === "BreakStatement" && parent.label === node) return;
        if (parent.type === "ContinueStatement" && parent.label === node)
          return;
        // Declarations are themselves identifiers (e.g. const X = ...).
        // We already collected those — skip them in the reference pass.
        if (
          parent.type === "VariableDeclarator" &&
          parent.id === node &&
          ancestors.length >= 2
        )
          return;
        if (
          (parent.type === "FunctionDeclaration" ||
            parent.type === "FunctionExpression" ||
            parent.type === "ArrowFunctionExpression" ||
            parent.type === "ClassDeclaration" ||
            parent.type === "ClassExpression") &&
          parent.id === node
        )
          return;
        if (parent.type === "ImportSpecifier" && parent.imported === node)
          return;
        if (
          parent.type === "ImportDefaultSpecifier" &&
          parent.local === node
        )
          return;
        if (
          parent.type === "ImportNamespaceSpecifier" &&
          parent.local === node
        )
          return;
        if (parent.type === "ImportSpecifier" && parent.local === node) return;
        // Pattern positions are declarations, not references.
        if (
          (parent.type === "ObjectPattern" ||
            parent.type === "ArrayPattern" ||
            parent.type === "RestElement" ||
            parent.type === "AssignmentPattern") &&
          // identifier directly nested in a pattern
          true
        )
          return;
        // Function/method params: skip identifier itself (declaration).
        if (
          (parent.type === "FunctionDeclaration" ||
            parent.type === "FunctionExpression" ||
            parent.type === "ArrowFunctionExpression") &&
          (parent.params as unknown[])?.includes(node)
        )
          return;
        referenced.add(node.name as string);
      },
    );

    const undeclared = [...referenced].filter(
      (name) => !declared.has(name) && !globals.has(name),
    );
    if (undeclared.length > 0) {
      throw new Error(
        `chonk-cinematic.html references ${undeclared.length} undefined symbol(s) — ` +
          `most likely orphan refs left behind by a strip:\n  ${undeclared.join(", ")}`,
      );
    }
  });

  it("animate loop never iterates over a dropped lab-internal array (regression lock for symbioteBodies / powderBodies / fruitOrbits)", () => {
    // Even with the AST scan above, name a few specific patterns we've
    // already burnt the workshop on. Catches `for (const X of Y)`
    // loops in the future even if the array is somehow re-declared
    // as an empty placeholder somewhere else.
    const droppedArrays = [
      "symbioteBodies",
      "powderBodies",
      "fruitOrbits",
      "fruitDotClouds",
      "fruitFadeMaterials",
    ];
    for (const name of droppedArrays) {
      expect(moduleSrc).not.toMatch(
        new RegExp(`for\\s*\\(\\s*(const|let|var)\\s+\\w+\\s+of\\s+${name}\\b`),
      );
    }
  });
});
