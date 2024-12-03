// q@ts-nocheck
/* qeslint-disable */
import { useRef, useState } from "react";
import { SearchInputStyles } from "./search-input.styles";
import SearchIconSvg from "../../../assets/side-nav-svgs/Search.svg?react";

interface SearchInputProps {
    callback?: (value: string) => void;
    callbackEnter?: (value: string) => void;
}

const SearchInput = ({ callback, callbackEnter }: SearchInputProps) => {
    const [input, setInput] = useState("");
    const inputRef = useRef(null);

    return (
        <SearchInputStyles>
            <div className="search-input-container">
                <div className="search-input-icon">
                    <SearchIconSvg />
                </div>
                <input
                    type="text"
                    className="search-input"
                    data-testid="search-input"
                    value={input}
                    onChange={(e) => {
                        setInput(e.target.value);
                        if (callback) callback(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            if (callback) {
                                callback(input);
                            }

                            if (callbackEnter) {
                                callbackEnter(input);
                            }
                        }
                    }}
                    ref={inputRef}
                />
            </div>
        </SearchInputStyles>
    );
};

const defaultProps = {
    callback: null,
    callbackEnter: null
};

export default SearchInput;
