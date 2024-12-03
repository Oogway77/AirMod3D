// q@ts-nocheck
/* qeslint-disable */
import styled from "styled-components";
import Tooltip from "@mui/material/Tooltip";
import { dmColorGreyTen } from "../../gui-variables.styles";

const TooltipContainer = styled.div``;

interface CustomTooltipProps {
    title: string | undefined;
    children: React.ReactElement;
    isRight?: boolean;
    isLeft?: boolean;
}

const position = (isRight?: boolean, isLeft?: boolean) => {
    if (isRight) {
        return "right";
    }

    if (isLeft) {
        return "left";
    }

    return "bottom";
};

const CustomTooltip = ({ title, children, isRight, isLeft }: CustomTooltipProps) =>
    title ? (
        <TooltipContainer>
            <Tooltip
                title={title}
                arrow
                enterNextDelay={1000}
                enterDelay={1000}
                leaveDelay={0}
                enterTouchDelay={0}
                placement={position(isRight, isLeft)}
                componentsProps={{
                    tooltip: {
                        sx: {
                            padding: "10px 20px 10px 20px",
                            fontSize: "0.8rem",
                            fontWeight: "400",
                            bgcolor: dmColorGreyTen,
                            "& .MuiTooltip-arrow": {
                                color: dmColorGreyTen
                            }
                        }
                    }
                }}
            >
                {children}
            </Tooltip>
        </TooltipContainer>
    ) : (
        <>{children}</>
    );

export default CustomTooltip;
