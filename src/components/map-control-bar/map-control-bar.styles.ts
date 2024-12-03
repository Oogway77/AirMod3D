import styled from "styled-components";

export const MapControlBarContainer = styled.div`
    position: absolute;
    right: 65px;
    bottom: 140px;
    z-index: 100;
    display: flex;
    flex-direction: column;

        .btn-container {
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: center;
        }
    
        .icon-button {
            background-color: white;
            border: 1px solid rgba(255, 255, 255, 0.1);
            cursor: pointer;
            width: 30px; // Set the width of the button
            height: 30px; // Set the height of the button
            margin: 5px; // Add some spacing between buttons
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); // Add shadow effect
            border-radius: 4px; // Optional: add rounded corners
        
            * {
                width: 20px; // Adjust icon size
                height: 20px; // Adjust icon size
            }
        
            &:hover {
                opacity: 0.7; // Add hover effect
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); // Increase shadow on hover
            }
        }
        
        @media only screen and (max-width: 600px) {
            .compass {
                margin-bottom: 40px;
            }
        }
    }
`;
