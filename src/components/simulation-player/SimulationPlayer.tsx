// @ts-nocheck
/* eslint-disable */
import { useEffect, useState, useRef } from "react";
import { Cesium3DTileStyle, Color } from "cesium";
import { FaPlay, FaStop, FaFastBackward, FaFastForward } from "react-icons/fa";
import { SimulationPlayerContainer, PlayButton } from "./simulation-player.style";

const SimulationPlayer = () => {
    const geoTech = window.geoTech;
    const playModelTool = geoTech.playModelTool;
    const [open, setOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [updatedGG, setUpdatedGG] = useState(false);
    const [count, setCount] = useState(0);
    const selectedModel = geoTech.poiManager.selectedPointCloud;

    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const onCloudGenerated = () => {
        setOpen(true);
    };

    const onDeactivated = () => {
        setOpen(false);
    };

    const onClickPlay = () => {
        console.error("click play");
        if (!isPlaying) {
            // playModelTool?.updateModel();
            // if (geoTech.poiManager.selectedModel) {
            //     console.error("yes");
            //     geoTech.poiManager.selectedModel.style = new Cesium3DTileStyle({
            //         pointSize: "5",
            //         color: "color('red')"
            //     });
            // }
        }
        setIsPlaying(!isPlaying);
    };

    const onClickPrev = () => {
        const inspectAttributes = (model) => {
            if (!model || !model._rootNode || !model._rootNode.children) {
                console.error("Model is not loaded or has no root node.");
                return;
            }

            // Loop through each node in the model
            model._rootNode.children.forEach((node) => {
                if (node._primitives) {
                    node._primitives.forEach((primitive) => {
                        // Log attributes of the primitive
                        console.log("Attributes:", primitive.attributes);
                    });
                }
            });
        };
        // inspectAttributes(selectedModel)
        console.error("on click prev");
    };

    // Function to be called every second
    const updateInterval = () => {
        console.log("Function called every second");
        setUpdatedGG(true);
        setCount((prevCount) => prevCount + 1); // Example action
    };

    useEffect(() => {
        // Set up interval when `isActive` changes
        if (isPlaying) {
            intervalRef.current = setInterval(updateInterval, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }

        // Clean up interval on component unmount or when `isActive` changes
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isPlaying]);

    useEffect(() => {
        if (updatedGG) {
            if (selectedModel) {
                const len = selectedModel.length;
                for (let i = 0; i < len; i++) {
                    const pointC = selectedModel.get(i);
                    const colorValue = Math.floor(Math.random() * 3);

                    if (colorValue === 0) {
                        pointC.color = Color.TRANSPARENT;
                    } else if (colorValue === 1) {
                        pointC.color = Color.RED;
                    } else {
                        pointC.color = Color.GREEN;
                    }
                }
                // selectedModel.forEach((primitive) => {
                //     console.error("eachpoint", primite);
                // })
            }
            // if (count % 3 === 0) {
            //     if (selectedModel) {
            //         selectedModel.style = new Cesium3DTileStyle({ color: "rgba(0, 255, 0, 0)" });
            //     }
            // }

            // if (count % 3 === 1) {
            //     if (selectedModel) {
            //         selectedModel.style = new Cesium3DTileStyle({ color: "color('red')" });
            //     }
            // }

            // if (count % 3 === 2) {
            //     if (selectedModel) {
            //         selectedModel.style = new Cesium3DTileStyle({ color: "rgba(0, 255, 0, 1)" });
            //     }
            // }
            // selectedModel.style = new Cesium3DTileStyle({ pointSize: "10", color: "color('blue')" });
            setUpdatedGG(false);
        }
    }, [updatedGG]);

    useEffect(() => {
        playModelTool?.cloudIsGenerated.addEventListener(onCloudGenerated);
        playModelTool?.deactivated.addEventListener(onDeactivated);
    }, []);

    const content = (
        <SimulationPlayerContainer id="simulate-container">
            <div className="panel">
                <div className="player-panel">
                    <PlayButton isPlaying={isPlaying} onClick={onClickPrev}>
                        <FaFastBackward className="player-icon" />
                    </PlayButton>

                    <PlayButton isPlaying={isPlaying} onClick={onClickPlay}>
                        {isPlaying ? <FaStop className="player-icon" /> : <FaPlay className="player-icon" />}
                    </PlayButton>

                    <PlayButton isPlaying={isPlaying} onClick={onClickPrev}>
                        <FaFastForward className="player-icon" />
                    </PlayButton>
                </div>
            </div>
        </SimulationPlayerContainer>
    );

    return <> {open && content}</>;
};

export default SimulationPlayer;
