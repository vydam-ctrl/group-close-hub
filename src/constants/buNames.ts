/**
 * Central source of truth for Business Unit (BU) display names in HO View.
 * Use these constants to ensure consistency across all HO View components and mock data.
 */
export const BU_DISPLAY_NAMES = {
    SERVICE_TRADING: "Tasco Service and Trading Company Limited",
    BOT: "Tasco BOT MTV Company Limited",
    VETC: "VETC Automatic Fee Collecting Co., Ltd / VETC JSC",
    LAND: "Tasco Land Company Limited (Tasco Land)",
    AUTO: "Tasco Auto JSC",
    DNP: "DNP Holding",
    NVT: "NVT Holdings Joint Stock Company",
    SAVICO: "Savico Investment Joint Stock Company"
} as const;

export type BU_KEY = keyof typeof BU_DISPLAY_NAMES;

/**
 * Mapping of internal BU IDs to official display names.
 */
export const BU_NAME_MAP: Record<string, string> = {
    "bu-1": BU_DISPLAY_NAMES.AUTO,
    "bu-2": BU_DISPLAY_NAMES.BOT,
    "bu-3": BU_DISPLAY_NAMES.LAND,
    "bu-4": BU_DISPLAY_NAMES.VETC,
    "bu-5": BU_DISPLAY_NAMES.SAVICO,
    "bu-6": BU_DISPLAY_NAMES.DNP,
    "bu-7": BU_DISPLAY_NAMES.NVT,
    "bu-8": BU_DISPLAY_NAMES.SERVICE_TRADING,

    // Existing aliases found in mock data
    "North America": BU_DISPLAY_NAMES.AUTO,
    "Europe": BU_DISPLAY_NAMES.BOT,
    "APAC": BU_DISPLAY_NAMES.LAND,
    "Latin America": BU_DISPLAY_NAMES.VETC,
    "Middle East": BU_DISPLAY_NAMES.SAVICO,

    // BizziAI specific aliases
    "Tasco Auto": BU_DISPLAY_NAMES.AUTO,
    "Tasco BOT": BU_DISPLAY_NAMES.BOT,
    "Tasco Real Estate": BU_DISPLAY_NAMES.LAND,
    "Innochi": BU_DISPLAY_NAMES.SAVICO // Assuming Innochi maps to Savico or another BU based on financial mock context
};
