// q@ts-nocheck
/* eslint-disable */
import "./toggle-switch.styles.scss";

// Switch component to toggle light and dark mode

interface ToggleSwitchProps {
    id?: string;
    checked?: boolean;
    disabled?: boolean | undefined;
    onChange?: (checked: boolean) => void;
}

const defaultProps: ToggleSwitchProps = {
    id: "",
    checked: false,
    disabled: false,
    onChange: undefined
};

const Switch = ({ id, checked, disabled, onChange }: ToggleSwitchProps) => (
    <>
        <input
            aria-label="react-switch-checkbox"
            checked={checked}
            className="react-switch-checkbox"
            onChange={() => onChange && onChange(!checked)}
            disabled={disabled}
            id={id}
            type="checkbox"
        />
        <label className="react-switch-label" htmlFor={id} style={{ background: !checked ? "#cc5de8" : "" }}>
            <span className="react-switch-button" />
        </label>
    </>
);

export default Switch;
