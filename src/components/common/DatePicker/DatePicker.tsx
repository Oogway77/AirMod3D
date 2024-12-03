// q@ts-nocheck
/* qeslint-disable */
import { DateView, DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { dmColorGreyFour, dmColorGreyOne } from "../../gui-variables.styles";
import { DatePickerContainer } from "./date-picker.styles";

interface DatePickerProps {
    value: Date | null;
    minDate?: Date | undefined;
    maxDate?: Date | undefined;
    views?: DateView[];
    label?: string;
    handleChangeDate: (date: Date) => void;
}

const CustomDatePicker = ({ value, minDate, maxDate, label, views, handleChangeDate }: DatePickerProps) => {
    const colorValue = dmColorGreyOne;

    return (
        <DatePickerContainer>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                    views={views}
                    value={value}
                    minDate={minDate}
                    maxDate={maxDate}
                    label={label}
                    slotProps={{
                        popper: {
                            sx: {
                                ".MuiPickersPopper-paper": {
                                    backgroundColor: dmColorGreyFour,
                                    color: colorValue
                                },
                                ".MuiDayCalendar-weekDayLabel": {
                                    color: "#007fff"
                                },
                                ".MuiPickersCalendarHeader-root": {
                                    color: colorValue
                                },
                                ".MuiPickersCalendarHeader-switchViewButton": {
                                    color: colorValue
                                },
                                ".MuiDayPicker-weekDayLabel": {
                                    color: colorValue
                                },
                                ".MuiPickersDay-root": {
                                    color: colorValue,
                                    background: dmColorGreyFour
                                },
                                ".MuiPickersDay-root:disabled": {
                                    color: colorValue,
                                    opacity: 0.5
                                },
                                ".MuiPickersArrowSwitcher-button": {
                                    color: colorValue
                                }
                            }
                        }
                    }}
                    onChange={(newValue: Date | null) => {
                        if (newValue) handleChangeDate(newValue);
                    }}
                />
            </LocalizationProvider>
        </DatePickerContainer>
    );
};

const defaultProps = {
    label: "",
    minDate: undefined,
    maxDate: undefined,
    views: ["year", "month", "day"]
};

export default CustomDatePicker;
