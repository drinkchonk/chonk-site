"use client";

export type DropRaceVoteTarget = {
  id: string;
  name: string;
  suburb: string;
  kind: "gym" | "suburb";
} | null;

export type DropRaceVoteModalProps = {
  open: boolean;
  target: DropRaceVoteTarget;
  onClose: () => void;
  onSubmitted: (target: DropRaceVoteTarget) => void;
};

export default function DropRaceVoteModal(_props: DropRaceVoteModalProps) {
  return null;
}
