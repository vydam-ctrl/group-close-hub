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
    tables?: {
        title?: string;
        columns: string[];
        rows: (string | number)[][];
    }[];
    insight?: string;
    chartSuggestion?: {
        type: "bar" | "line" | "pie" | "donut";
        description: string;
        xAxis?: string;
        yAxis?: string;
        highlight?: string;
        threshold?: string;
        sort?: string;
        series?: { key: string; name: string; color?: string }[];
    };
    chartData?: any[];
    charts?: {
        suggestion: {
            type: "bar" | "line" | "pie" | "donut";
            description: string;
            xAxis?: string;
            yAxis?: string;
            threshold?: string;
            series?: { key: string; name: string; color?: string }[];
        };
        data: any[];
    }[];
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
        question: "Lọc cho tôi những công ty có tỷ lệ Interest expense / Net profit cao",
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
    },
    {
        id: "q_material_supply_van_phuc",
        topic: "Material Supply – Project Tracking",
        question: "Truy xuất tổng khối lượng và giá trị vật tư đã cấp cho công trình Cầu Vân Phúc (Hà Nội) tính từ đầu năm 2025 đến thời điểm hiện tại.",
        answerType: "table",
        tableData: {
            columns: ["Hạng mục", "Vật tư", "Đơn vị", "Khối lượng đã cấp", "Giá trị (Tỷ VNĐ)"],
            rows: [
                ["Trụ cầu", "Thép xây dựng", "Tấn", 120, 2.28],
                ["Mặt cầu", "Bê tông nhựa", "Tấn", 680, 10.6],
                ["Móng", "Cát vàng", "m³", 440, 1.32]
            ]
        },
        insight: "Tổng khối lượng và giá trị vật tư cho thấy hạng mục mặt cầu chiếm tỷ trọng chi phí lớn nhất trong giai đoạn thi công hiện tại.",
        chartSuggestion: {
            type: "bar",
            description: "Giá trị vật tư theo hạng mục - Cầu Vân Phúc",
            xAxis: "Hạng mục",
            yAxis: "Giá trị (Tỷ VNĐ)"
        },
        chartData: [
            { name: "Trụ cầu", value: 2.28 },
            { name: "Mặt cầu", value: 10.6 },
            { name: "Móng", value: 1.32 }
        ]
    },
    {
        id: "q_material_efficiency_my_dinh",
        topic: "Material Efficiency – Project Performance",
        question: "Lập bảng báo cáo hiệu quả vật tư dự án Mỹ Đình - Ba Sao - Bái Đính.",
        answerType: "table",
        tableData: {
            columns: ["Hạng mục", "Vật tư", "Kế hoạch tổng", "% Tiến độ thực tế", "Trạng thái", "Khối lượng thực tế", "Giá trị (Tỷ VNĐ)", "% Hao hụt / Tiết kiệm"],
            rows: [
                ["Mặt đường", "Bê tông nhựa", "1.000 tấn", "85%", "Trễ hạn", "820 tấn", 12.8, "+6.5%"],
                ["Móng", "Cát vàng", "2.000 m³", "90%", "Đúng hạn", "1.700 m³", 2.1, "-5.6%"],
                ["Trụ", "Thép", "500 tấn", "100%", "Đúng hạn", "560 tấn", 10.3, "+12.0%"]
            ]
        },
        insight: "Hạng mục trụ có mức hao hụt vật tư cao nhất do khối lượng thực tế vượt kế hoạch, trong khi hạng mục móng ghi nhận hiệu quả sử dụng vật tư tốt.",
        chartSuggestion: {
            type: "bar",
            description: "Tỷ lệ Hao hụt (+) / Tiết kiệm (-) theo hạng mục (%)",
            xAxis: "Hạng mục",
            yAxis: "% Hao hụt / Tiết kiệm",
            highlight: "Value > 0"
        },
        chartData: [
            { name: "Mặt đường", value: 6.5 },
            { name: "Móng", value: -5.6 },
            { name: "Trụ", value: 12.0 }
        ]
    },
    {
        id: "q_design_vs_actual_steel",
        topic: "Design vs Actual – Material Variance",
        question: "So sánh dữ liệu thực tế tiêu hao với định mức thiết kế cho hạng mục Thép tại Dự án mở rộng cao tốc TP. Hồ Chí Minh - Long Thành.",
        answerType: "table",
        tableData: {
            columns: ["Giai đoạn", "Định mức thiết kế", "Thực tế", "Chênh lệch", "% Chênh lệch", "Nguyên nhân chính"],
            rows: [
                ["GĐ 1 – Thi công móng", 180, 195, 15, "+8.3%", "Điều chỉnh thiết kế móng và hao hụt trong quá trình cắt, gia công thép."],
                ["GĐ 2 – Trụ cầu", 220, 210, -10, "-4.5%", "—"],
                ["GĐ 3 – Dầm & kết cấu", 120, 140, 20, "+16.7%", "Bổ sung gia cố kết cấu do điều kiện địa chất và yêu cầu tăng hệ số an toàn."]
            ]
        },
        insight: "Các giai đoạn 1 and 3 có mức chênh lệch vượt ngưỡng 5%, phản ánh rủi ro trong kiểm soát định mức và thay đổi thiết kế trong quá trình thi công.",
        chartSuggestion: {
            type: "line",
            description: "Biến động sai lệch tiêu hao thép so với thiết kế (%)",
            xAxis: "Giai đoạn",
            yAxis: "% Chênh lệch",
            threshold: "5%"
        },
        chartData: [
            { month: "GĐ 1", value: 8.3 },
            { month: "GĐ 2", value: -4.5 },
            { month: "GĐ 3", value: 16.7 }
        ]
    },
    {
        id: "q_price_increase_simulation_sand",
        topic: "Scenario Simulation – Material Price Impact",
        question: "Chạy kịch bản mô phỏng nếu giá xi măng tăng thêm 5% từ tháng sau, dự báo tác động đến tổng chi phí vật tư và biên lợi nhuận.",
        answerType: "summary",
        answerText: "Giá xi măng tăng 5% làm chi phí vật tư tăng tương ứng tại tất cả dự án, dẫn đến biên lợi nhuận giảm từ 0,4% đến 0,5%. Dù mức tăng chi phí tuyệt đối không lớn, tác động cộng dồn có thể ảnh hưởng đáng kể đến hiệu quả danh mục dự án.",
        tables: [
            {
                title: "Table 1 – Material Cost Impact",
                columns: ["Dự án", "Chi phí xi măng hiện tại (Tỷ)", "Chi phí sau tăng giá (Tỷ)", "Chênh lệch", "% Tăng chi phí"],
                rows: [
                    ["Mỹ Đình – Ba Sao – Bái Đính", 2.40, 2.52, "+0.12", "+5.0%"],
                    ["Cầu Vân Phúc", 1.80, 1.89, "+0.09", "+5.0%"],
                    ["Cao tốc TP.HCM – Long Thành", 3.20, 3.36, "+0.16", "+5.0%"]
                ]
            },
            {
                title: "Table 2 – Profit Margin Impact",
                columns: ["Dự án", "Tổng chi phí vật tư (Trước)", "Tổng chi phí vật tư (Sau)", "Biên LN trước", "Biên LN sau", "Δ Biên LN"],
                rows: [
                    ["Mỹ Đình – Ba Sao – Bái Đính", 25.0, 25.12, "18.0%", "17.5%", "-0.5%"],
                    ["Cầu Vân Phúc", 22.6, 22.69, "16.5%", "16.1%", "-0.4%"],
                    ["Cao tốc TP.HCM – Long Thành", 30.4, 30.56, "14.0%", "13.5%", "-0.5%"]
                ]
            }
        ],
        insight: "Hệ thống khuyến nghị rà soát các hợp đồng cung ứng dài hạn để chốt giá hoặc đàm phán lại tiến độ giao hàng nhằm giảm thiểu rủi ro tăng giá vật liệu.",
        charts: [
            {
                suggestion: {
                    type: "bar",
                    description: "Material Cost Impact (Billion VND)",
                    xAxis: "name",
                    series: [
                        { key: "before", name: "Before", color: "hsl(var(--primary))" },
                        { key: "after", name: "After", color: "#94A3B8" }
                    ]
                },
                data: [
                    { name: "Mỹ Đình", before: 2.40, after: 2.52, increase: "+5.0%" },
                    { name: "Cầu Vân Phúc", before: 1.80, after: 1.89, increase: "+5.0%" },
                    { name: "Cao tốc", before: 3.20, after: 3.36, increase: "+5.0%" }
                ]
            },
            {
                suggestion: {
                    type: "line",
                    description: "Profit Margin Impact (%)",
                    xAxis: "name",
                    series: [
                        { key: "marginBefore", name: "Margin Before", color: "hsl(var(--primary))" },
                        { key: "marginAfter", name: "Margin After", color: "#F87171" }
                    ]
                },
                data: [
                    { name: "Mỹ Đình", marginBefore: 18.0, marginAfter: 17.5, delta: "-0.5%" },
                    { name: "Cầu Vân Phúc", marginBefore: 16.5, marginAfter: 16.1, delta: "-0.4%" },
                    { name: "Cao tốc", marginBefore: 14.0, marginAfter: 13.5, delta: "-0.5%" }
                ]
            }
        ]
    }
];
