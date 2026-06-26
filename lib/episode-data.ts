import type { EpisodeContentData } from "./types";

export const boatsEpisodeData: EpisodeContentData = {
  people: [3, 2, 2, 1],
  limit: 3,
  examples: [
    {
      input: "people = [1,2], limit = 3",
      output: "1",
      explanation: "1 boat (1, 2)",
    },
    {
      input: "people = [3,2,2,1], limit = 3",
      output: "3",
      explanation: "3 boats (1,2), (2), (3)",
    },
    {
      input: "people = [3,5,3,4], limit = 5",
      output: "4",
      explanation: "4 boats (3), (3), (4), (5)",
    },
  ],
  diagramSteps: [
    {
      left: 0,
      right: 3,
      highlight: [0, 3],
      label: "Pair lightest (1) with heaviest (3) — both fit in one boat",
      boats: 1,
    },
    {
      left: 1,
      right: 2,
      highlight: [1, 2],
      label: "Pair 2 with 2 — they fit together",
      boats: 2,
    },
    {
      left: 2,
      right: 1,
      highlight: [2],
      label: "Last person (2) takes a boat alone",
      boats: 3,
    },
  ],
  starterCode: `/**
 * @param {number[]} people
 * @param {number} limit
 * @return {number}
 */
function numRescueBoats(people, limit) {
  // Your code here
  
}`,
  bruteForceCode: `function numRescueBoats(people, limit) {
  people.sort((a, b) => a - b);
  let boats = 0;
  const used = new Array(people.length).fill(false);

  for (let i = 0; i < people.length; i++) {
    if (used[i]) continue;
    used[i] = true;
    boats++;

    for (let j = i + 1; j < people.length; j++) {
      if (!used[j] && people[i] + people[j] <= limit) {
        used[j] = true;
        break;
      }
    }
  }
  return boats;
}`,
  solutionCode: `function numRescueBoats(people, limit) {
  people.sort((a, b) => a - b);
  let left = 0;
  let right = people.length - 1;
  let boats = 0;

  while (left <= right) {
    if (people[left] + people[right] <= limit) {
      left++;
    }
    right--;
    boats++;
  }
  return boats;
}`,
  complexityVariants: [
    { variant: "Brute Force", time: "O(n²)", space: "O(n)" },
    { variant: "Two Pointers", time: "O(n log n)", space: "O(1)" },
  ],
  relatedProblems: [
    {
      title: "Two Sum II",
      url: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/",
      difficulty: "medium",
    },
    {
      title: "3Sum",
      url: "https://leetcode.com/problems/3sum/",
      difficulty: "medium",
    },
    {
      title: "Container With Most Water",
      url: "https://leetcode.com/problems/container-with-most-water/",
      difficulty: "medium",
    },
  ],
  quizQuestions: [
    {
      id: "q1",
      question: "Why do we sort the array before applying two pointers?",
      options: [
        "Sorting is required by the problem statement",
        "It lets us pair the lightest with the heaviest greedily",
        "It reduces space complexity to O(1)",
        "It eliminates the need for a while loop",
      ],
      correctIndex: 1,
      explanation:
        "Sorting enables the greedy strategy: pairing the lightest remaining person with the heaviest often minimizes boats.",
    },
    {
      id: "q2",
      question:
        "When people[left] + people[right] > limit, what should we do?",
      options: [
        "Move left pointer right",
        "Move right pointer left (heaviest goes alone)",
        "Skip both pointers",
        "Restart from the beginning",
      ],
      correctIndex: 1,
      explanation:
        "The heaviest person cannot pair with anyone, so we send them alone and move the right pointer left.",
    },
    {
      id: "q3",
      question: "What is the time complexity of the optimal solution?",
      options: ["O(n)", "O(n log n)", "O(n²)", "O(2^n)"],
      correctIndex: 1,
      explanation:
        "Sorting dominates at O(n log n); the two-pointer scan is O(n).",
    },
  ],
  takeaways: [
    "Sort first when using inward two pointers on unsorted input.",
    "Greedy pairing of lightest + heaviest minimizes resource usage.",
    "When a pair doesn't fit, the heavier element must go alone.",
    "Two pointers reduce O(n²) brute force to O(n) after sorting.",
  ],
};

export function getEpisodeData(
  patternSlug: string,
  episodeSlug: string
): EpisodeContentData | null {
  if (
    patternSlug === "two-pointers" &&
    episodeSlug === "boats-to-save-people"
  ) {
    return boatsEpisodeData;
  }
  return null;
}
