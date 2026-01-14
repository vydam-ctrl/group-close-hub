export interface ChatMessage {
    id: string;
    topic?: string;
    question: string;
    answerType?: "text" | "table" | "summary";
    answer?: string;
    answerText?: string;
    tableData?: {
        columns: string[];
        rows: (string | number)[][];
    };
    insight?: string;
    chartSuggestion?: {
        type: "bar" | "line" | "pie" | "donut";
        description: string;
        xAxis?: string;
        yAxis?: string;
        highlight?: string;
        threshold?: string;
        sort?: string;
    };
}

export const bizziAIQuestions: ChatMessage[] = [
    {
        "id": "q1",
        "question": "What does 'In Progress (on EPM)' mean?",
        "answer": "This status indicates that the consolidation process is currently being executed in the EPM system and has not yet been finalized."
    },
    {
        "id": "q2",
        "question": "When can I download the consolidated reports?",
        "answer": "You can download Excel or PDF files when the status is either Completed or Closed."
    },
    {
        "id": "q3",
        "question": "What is the difference between Completed and Closed?",
        "answer": "Completed means consolidation is finished, while Closed indicates the period is locked after final approval."
    },
    {
        "id": "q4",
        "question": "Why are some Fiscal Years grouped by default?",
        "answer": "Fiscal Years are grouped to provide a high-level consolidated view. You can expand each year to view quarterly details."
    },
    {
        "id": "q5",
        "question": "Who provides final approval for consolidated reports?",
        "answer": "Final approval is typically granted by the Group Controller or CFO after all BU submissions are reconciled."
    },
    {
        "id": "q6",
        "question": "How is the Net Debt / EBITDA threshold calculated?",
        "answer": "The threshold is a fixed target (typically 3.0x or 3.5x) derived from our group bank covenants and financial policy."
    },
    {
        "id": "q7",
        "question": "What is included in the 'Executive Snapshot'?",
        "answer": "The snapshot aggregates Revenue, EBITDA, Net Profit, Cash, and Net Debt for the selected period and scope (Group or specific BU)."
    },
    {
        "id": "q8",
        "question": "Can I see performance vs budget for previous years?",
        "answer": "Yes, by switching the Granularity to 'Year' and selecting the desired year in the Period selector."
    }
];
