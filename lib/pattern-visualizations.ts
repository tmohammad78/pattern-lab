export interface PointerVizStep {
  left?: number;
  right?: number;
  slow?: number;
  fast?: number;
  highlight: number[];
  label: string;
  status: string;
}

export interface VariantVisualization {
  id: string;
  title: string;
  meta: string;
  array: number[];
  steps: PointerVizStep[];
}

export const twoPointerVisualizations: VariantVisualization[] = [
  {
    id: "inward",
    title: "Inward Traversal",
    meta: "nums = [1, 2, 3, 4, 5]  ·  target = 6",
    array: [1, 2, 3, 4, 5],
    steps: [
      {
        left: 0,
        right: 4,
        highlight: [0, 4],
        label: "Check pair nums[0] + nums[4] = 1 + 5 = 6 ✓ target found",
        status: "sum: 6",
      },
      {
        left: 1,
        right: 3,
        highlight: [1, 3],
        label: "Move inward: nums[1] + nums[3] = 2 + 4 = 6 ✓",
        status: "sum: 6",
      },
      {
        left: 2,
        right: 2,
        highlight: [2],
        label: "Pointers meet at middle — scan complete",
        status: "done",
      },
    ],
  },
  {
    id: "unidirectional",
    title: "Unidirectional Traversal",
    meta: "nums = [1, 1, 2, 2, 3]  ·  remove duplicates",
    array: [1, 1, 2, 2, 3],
    steps: [
      {
        slow: 0,
        fast: 0,
        highlight: [0],
        label: "slow marks unique boundary; fast explores ahead",
        status: "unique: 1",
      },
      {
        slow: 0,
        fast: 1,
        highlight: [0, 1],
        label: "nums[fast] == nums[slow] — duplicate, skip",
        status: "skip",
      },
      {
        slow: 0,
        fast: 2,
        highlight: [0, 2],
        label: "nums[fast] is new → slow++ and write nums[fast]",
        status: "unique: 2",
      },
      {
        slow: 1,
        fast: 3,
        highlight: [0, 1, 2],
        label: "Continue until fast reaches end; unique count = slow + 1",
        status: "unique: 3",
      },
    ],
  },
  {
    id: "staged",
    title: "Staged Traversal",
    meta: "nums = [-1, 0, 1, 2, -1, -4]  ·  three sum",
    array: [-1, 0, 1, 2, -1, -4],
    steps: [
      {
        left: 1,
        right: 5,
        highlight: [0, 1, 5],
        label: "Phase 1: fix index i, run inward pointers on the rest",
        status: "i = 0",
      },
      {
        left: 1,
        right: 2,
        highlight: [0, 1, 2],
        label: "nums[1] + nums[2] + nums[0] = 0 + 1 + (-1) = 0 ✓",
        status: "triplet found",
      },
      {
        left: 2,
        right: 5,
        highlight: [1, 2, 5],
        label: "Phase 2: advance fixed index i and reset pointers",
        status: "i = 1",
      },
      {
        left: 3,
        right: 5,
        highlight: [1, 3, 5],
        label: "Search again with new anchor — staged reset of left/right",
        status: "scanning",
      },
    ],
  },
];

export function getPatternVisualizations(
  patternSlug: string
): VariantVisualization[] {
  if (patternSlug === "two-pointers") return twoPointerVisualizations;
  return [];
}
