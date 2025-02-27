module.exports = {
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\S+)?: (\S+)-(\S+) (\S(?:.*\S)?)$/,
      headerCorrespondence: [
        "type",
        "ticketKey",
        "ticketNumber",
        "description",
      ],
    },
  },
  plugins: [
    {
      rules: {
        "header-format": (parsed, _when) => {
          const headerPattern = /^(\S+)?: (\S+)-(\S+) (\S(?:.*\S)?)$/;
          if (!headerPattern.test(parsed.header)) {
            throw new Error(
              '❌ Invalid commit message format!(check for any extra whitespace character.) Expected format: "type: ticketKey-ticketNumber description'
            );
          }
          return [true];
        },
        "type-empty": (parsed, _when) => {
          const { type } = parsed;
          if (!type) {
            return [false, "❌ type is required"];
          }
          return [true];
        },
        "type-enum": (parsed, _when, expectedValues) => {
          const { type } = parsed;
          if (!type || !expectedValues.includes(type)) {
            return [
              false,
              `❌ type must be one of ${expectedValues.join(", ")}`,
            ];
          }
          return [true];
        },
        "ticket-key-format": (parsed, _when, expectedValues) => {
          const { ticketKey } = parsed;
          if (ticketKey.length > expectedValues) {
            return [
              false,
              `❌ ticketKey length must be atmost ${expectedValues} characters. The current length is ${ticketKey.length} characters`,
            ];
          }
          if (!parsed.ticketKey || !/^[A-Z]+$/.test(parsed.ticketKey)) {
            return [false, "❌ ticketKey must be uppercase letters only."];
          }
          return [true];
        },
        "ticket-number-format": (parsed, _when) => {
          const { ticketNumber } = parsed;
          if (!ticketNumber || !/^\d+$/.test(ticketNumber)) {
            return [false, "❌ ticketNumber must be numeric only"];
          }
          return [true];
        },
        "description-min-length": (parsed, _when, expectedValues) => {
          const { description } = parsed;
          if (!description || description?.length < expectedValues) {
            return [
              false,
              `❌ Description must be at least ${expectedValues} characters. The current length is ${
                description.length || 0
              } characters`,
            ];
          }
          return [true];
        },
        "description-max-length": (parsed, _when, expectedValues) => {
          const { description } = parsed;
          if (!description || description?.length > expectedValues) {
            return [
              false,
              `❌ Description length must be at most ${expectedValues} characters. The current length is ${
                description.length || 0
              } characters`,
            ];
          }
          return [true];
        },
        "description-no-multiple-spaces": (parsed, _when) => {
          const { description } = parsed;
          if (description && /\s{2,}/.test(description)) {
            return [
              false,
              "❌ Description must not contain multiple consecutive spaces",
            ];
          }
          return [true];
        },
      },
    },
  ],
  rules: {
    "header-format": [2, "always"],
    "type-empty": [2, "never"],
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "chore",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "build",
        "ci",
        "revert",
        "security",
        "breaking",
        "wip",
      ],
    ],
    "ticket-key-format": [2, "always", 10],
    "ticket-number-format": [2, "always"],
    "description-min-length": [2, "always", 10],
    "description-max-length": [2, "always", 50],
    "description-no-multiple-spaces": [2, "always"],
  },
};
