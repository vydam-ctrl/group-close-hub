
import React, { useEffect, useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { format, startOfYear, endOfYear, startOfQuarter, endOfQuarter, startOfMonth, endOfMonth, setYear, setQuarter, setMonth, isWithinInterval } from 'date-fns';
import { cn } from '@/lib/utils';
import { DateRange } from 'react-day-picker';

export type PeriodType = 'Annual' | 'Quarterly' | 'Monthly' | 'Custom';

interface ReportingPeriodSelectorProps {
    onPeriodChange?: (period: { type: PeriodType; startDate: Date; endDate: Date }) => void;
    className?: string;
}

export function ReportingPeriodSelector({ onPeriodChange, className }: ReportingPeriodSelectorProps) {
    const [periodType, setPeriodType] = useState<PeriodType>('Annual');
    const [year, setYear] = useState<number>(new Date().getFullYear() - 1);
    const [quarter, setQuarter] = useState<string>('1'); // 1-4
    const [month, setMonth] = useState<string>('0'); // 0-11
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: startOfYear(new Date(new Date().getFullYear() - 1, 0, 1)),
        to: endOfYear(new Date(new Date().getFullYear() - 1, 0, 1)),
    });

    // Generate year options (FY 2025 and past 4 years)
    const currentYear = new Date().getFullYear();
    const maxFY = currentYear - 1;
    const years = Array.from({ length: 5 }, (_, i) => maxFY - i);

    // Update date range when selections change
    useEffect(() => {
        let start: Date;
        let end: Date;
        const baseDate = new Date();
        baseDate.setFullYear(year);

        switch (periodType) {
            case 'Annual':
                start = startOfYear(baseDate);
                end = endOfYear(baseDate);
                break;
            case 'Quarterly':
                const qIndex = parseInt(quarter) - 1;
                start = new Date(year, qIndex * 3, 1);
                end = endOfQuarter(start);
                break;
            case 'Monthly':
                const mIndex = parseInt(month);
                start = new Date(year, mIndex, 1);
                end = endOfMonth(start);
                break;
            case 'Custom':
                // For custom, we rely on the dateRange state, but if it's unset or invalid for the year, we might reset it
                // However, we'll handle the "locking" to fiscal year in the Calendar component properties
                // initial render fallback
                if (!dateRange?.from || !dateRange?.to) {
                    start = startOfYear(baseDate);
                    end = endOfYear(baseDate);
                } else {
                    // check if within year
                    if (dateRange.from.getFullYear() !== year) {
                        // If the custom range drifts from the selected year, reset it??
                        // Or maybe better: updates to 'year' should reset custom range
                        start = startOfYear(baseDate);
                        end = endOfYear(baseDate);
                    } else {
                        return; // Don't override the manually selected range if it's valid
                    }
                }
                break;
        }

        setDateRange({ from: start, to: end });
        onPeriodChange?.({ type: periodType, startDate: start, endDate: end });

    }, [periodType, year, quarter, month]);

    // Handle custom date selection
    const handleCustomDateSelect = (range: DateRange | undefined) => {
        if (range?.from) {
            // Ensure selected dates are within the selected fiscal year
            if (range.from.getFullYear() !== year) return;
            if (range.to && range.to.getFullYear() !== year) return;

            setDateRange(range);
            if (range.from && range.to) {
                onPeriodChange?.({ type: 'Custom', startDate: range.from, endDate: range.to });
            }
        }
    };

    return (
        <div className={cn("flex flex-wrap items-center gap-2", className)}>
            {/* Period Type Selector */}
            <Select value={periodType} onValueChange={(val: PeriodType) => setPeriodType(val)}>
                <SelectTrigger className="w-[120px] h-9 bg-background">
                    <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="Annual">Annual</SelectItem>
                    <SelectItem value="Quarterly">Quarterly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                </SelectContent>
            </Select>

            {/* Year Selector */}
            <Select value={year.toString()} onValueChange={(val) => setYear(parseInt(val))}>
                <SelectTrigger className="w-[100px] h-9 bg-background">
                    <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                    {years.map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                            FY {y}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            {/* Conditional Selectors */}
            {periodType === 'Quarterly' && (
                <Select value={quarter} onValueChange={setQuarter}>
                    <SelectTrigger className="w-[120px] h-9 bg-background">
                        <SelectValue placeholder="Quarter" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">Q1 (Jan-Mar)</SelectItem>
                        <SelectItem value="2">Q2 (Apr-Jun)</SelectItem>
                        <SelectItem value="3">Q3 (Jul-Sep)</SelectItem>
                        <SelectItem value="4">Q4 (Oct-Dec)</SelectItem>
                    </SelectContent>
                </Select>
            )}

            {periodType === 'Monthly' && (
                <Select value={month} onValueChange={setMonth}>
                    <SelectTrigger className="w-[140px] h-9 bg-background">
                        <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                            <SelectItem key={i} value={i.toString()}>
                                {format(new Date(year, i, 1), 'MMMM')}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            {periodType === 'Custom' && (
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                                "w-[240px] justify-start text-left font-normal h-9",
                                !dateRange && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {dateRange?.from ? (
                                dateRange.to ? (
                                    <>
                                        {format(dateRange.from, "LLL dd, y")} -{" "}
                                        {format(dateRange.to, "LLL dd, y")}
                                    </>
                                ) : (
                                    format(dateRange.from, "LLL dd, y")
                                )
                            ) : (
                                <span>Pick a date</span>
                            )}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={new Date(year, 0)}
                            selected={dateRange}
                            onSelect={handleCustomDateSelect}
                            numberOfMonths={2}
                            fromDate={startOfYear(new Date(year, 0))}
                            toDate={endOfYear(new Date(year, 0))}
                        />
                    </PopoverContent>
                </Popover>
            )}

            {/* Read-only Date Display for non-custom types */}
            {periodType !== 'Custom' && dateRange?.from && dateRange?.to && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground px-2 bg-muted/50 rounded-md h-9 border border-border">
                    <span>{format(dateRange.from, 'MMM d, yyyy')}</span>
                    <ArrowRight className="h-3 w-3" />
                    <span>{format(dateRange.to, 'MMM d, yyyy')}</span>
                </div>
            )}
        </div>
    );
}
