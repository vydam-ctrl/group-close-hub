import { BU_DISPLAY_NAMES } from '@/constants/buNames';

export interface BizziAIQA {
    id: string;
    topic: string;
    question: string;
    answerType: "text" | "table" | "summary";
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
    chartData?: any[];
}

export const bizziAIFinancialMock: BizziAIQA[] = [
    {
        id: "q_netsales_tasco_auto",
        topic: "TASCO Group – Financial Performance 2025",
        question: `Cho tôi Net Sales của ${BU_DISPLAY_NAMES.AUTO} vào tháng 5/2025`,
        answerType: "text",
        answerText: `Net Sales của ${BU_DISPLAY_NAMES.AUTO} trong tháng 5/2025 đạt 3.800 tỷ VND. Mức doanh thu này cao hơn trung bình các tháng đầu năm, phản ánh nhu cầu thị trường và hoạt động bán hàng được cải thiện.`,
        chartSuggestion: {
            type: "bar",
            description: `Net Sales theo tháng của ${BU_DISPLAY_NAMES.AUTO} (01–06/2025)`,
            xAxis: "Tháng (01–06/2025)",
            yAxis: "Net Sales",
            highlight: "Tháng 5/2025"
        },
        chartData: [
            { month: "Tháng 1", value: 3100 },
            { month: "Tháng 2", value: 2900 },
            { month: "Tháng 3", value: 3200 },
            { month: "Tháng 4", value: 3400 },
            { month: "Tháng 5", value: 3800 },
            { month: "Tháng 6", value: 3600 }
        ]
    },
    {
        id: "q_promo_ratio_innochi",
        topic: "TASCO Group – Financial Performance 2025",
        question: `Lọc cho tôi những tháng có tỷ lệ Sale promotion / Sale > 10% của ${BU_DISPLAY_NAMES.SAVICO}`,
        answerType: "table",
        tableData: {
            columns: ["Tháng", "Net Sales", "Sales Promotion", "Promotion / Sales (%)"],
            rows: [
                ["05/2025", 1200, 150, "12.5%"],
                ["06/2025", 1300, 170, "13.1%"]
            ]
        },
        insight: `Các tháng này cho thấy ${BU_DISPLAY_NAMES.SAVICO} đẩy mạnh các chương trình khuyến mãi, có thể nhằm kích cầu hoặc hỗ trợ tăng trưởng doanh số.`,
        chartSuggestion: {
            type: "line",
            description: `Tỷ lệ Promotion / Sales theo tháng của ${BU_DISPLAY_NAMES.SAVICO}`,
            xAxis: "Tháng",
            yAxis: "Promotion / Sales (%)",
            threshold: "10%"
        },
        chartData: [
            { month: "01/2025", value: 8.5 },
            { month: "02/2025", value: 9.2 },
            { month: "03/2025", value: 7.8 },
            { month: "04/2025", value: 9.5 },
            { month: "05/2025", value: 12.5 },
            { month: "06/2025", value: 13.1 }
        ]
    },
    {
        id: "q_interest_netprofit_ratio",
        topic: "TASCO Group – Financial Performance 2025",
        question: "Lọc cho tôi những công ty có tỷ Interest expense / Net profit",
        answerType: "table",
        tableData: {
            columns: ["Công ty", "Interest / Net Profit (%)"],
            rows: [
                [BU_DISPLAY_NAMES.BOT, "161%"],
                [BU_DISPLAY_NAMES.LAND, "122%"],
                [BU_DISPLAY_NAMES.SAVICO, "46%"],
                [BU_DISPLAY_NAMES.AUTO, "39%"]
            ]
        },
        insight: `${BU_DISPLAY_NAMES.BOT} và ${BU_DISPLAY_NAMES.LAND} có tỷ lệ chi phí lãi vay trên lợi nhuận cao, cho thấy áp lực tài chính lớn và mức độ phụ thuộc vào vốn vay.`,
        chartSuggestion: {
            type: "bar",
            description: "Tỷ lệ Interest expense / Net profit theo công ty",
            sort: "Descending by Interest / Net Profit"
        },
        chartData: [
            { name: BU_DISPLAY_NAMES.BOT, value: 161 },
            { name: BU_DISPLAY_NAMES.LAND, value: 122 },
            { name: BU_DISPLAY_NAMES.SAVICO, value: 46 },
            { name: BU_DISPLAY_NAMES.AUTO, value: 39 }
        ]
    },
    {
        id: "q_netprofit_contribution_2025",
        topic: "TASCO Group – Financial Performance 2025",
        question: "Cho tôi tỷ lệ Net profit contribution của từng công ty trong 2025",
        answerType: "table",
        tableData: {
            columns: ["Công ty", "Net Profit", "Tỷ lệ đóng góp (%)"],
            rows: [
                [BU_DISPLAY_NAMES.AUTO, 3200, "49.6%"],
                [BU_DISPLAY_NAMES.BOT, 1300, "20.2%"],
                [BU_DISPLAY_NAMES.SAVICO, 1050, "16.3%"],
                [BU_DISPLAY_NAMES.LAND, 900, "14.0%"]
            ]
        },
        insight: `${BU_DISPLAY_NAMES.AUTO} là đơn vị đóng góp lợi nhuận lớn nhất, chiếm gần một nửa lợi nhuận toàn Tập đoàn.`,
        chartSuggestion: {
            type: "donut",
            description: "Tỷ trọng lợi nhuận theo công ty"
        },
        chartData: [
            { name: BU_DISPLAY_NAMES.AUTO, value: 3200 },
            { name: BU_DISPLAY_NAMES.BOT, value: 1300 },
            { name: BU_DISPLAY_NAMES.SAVICO, value: 1050 },
            { name: BU_DISPLAY_NAMES.LAND, value: 900 }
        ]
    },
    {
        id: "q_executive_overview_2025",
        topic: "TASCO Group – Financial Performance 2025",
        question: "Tổng quan về tình hình tài chính của Tập đoàn Tasco và các công ty con cho năm 2025",
        answerType: "summary",
        answerText: `Năm 2025, TASCO Group đạt 77.100 tỷ VND doanh thu và 6.450 tỷ VND lợi nhuận ròng. ${BU_DISPLAY_NAMES.AUTO} là động lực chính về doanh thu và lợi nhuận. ${BU_DISPLAY_NAMES.SAVICO} tăng trưởng ổn định nhưng có dấu hiệu gia tăng chi phí khuyến mãi. ${BU_DISPLAY_NAMES.BOT} và ${BU_DISPLAY_NAMES.LAND} chịu áp lực lãi vay cao, ảnh hưởng đến hiệu quả lợi nhuận. Tổng thể, Tập đoàn duy trì kết quả tích cực nhưng cần tối ưu cấu trúc vốn và chi phí tài chính.`,
        chartSuggestion: {
            type: "bar",
            description: "Net Profit by company (Billion VND)"
        },
        chartData: [
            { name: BU_DISPLAY_NAMES.AUTO, value: 3200 },
            { name: BU_DISPLAY_NAMES.BOT, value: 1300 },
            { name: BU_DISPLAY_NAMES.SAVICO, value: 1050 },
            { name: BU_DISPLAY_NAMES.LAND, value: 900 }
        ]
    }
];
