// Copyright 2024 wu
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
import CanvasDraw from "react-canvas-draw";
import { useContext, useRef, useState } from "react";
import { Slider, Space, NavBar } from "antd-mobile";
import { RollbackOutlined, CheckOutlined } from "@ant-design/icons";
import { Typography, ColorPicker, Button } from "antd";
import { SubmitInfoContext } from "@/contexts/mobileEditContext";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

const defaultProps = {
    loadTimeOffset: 5,
    lazyRadius: 0,
    gridColor: "rgba(150,150,150,0.17)",
    hideGrid: true,
    imgSrc: "",
    saveData: "",
    immediateLoading: false,
    hideInterface: false,
    disabled: false,
};

export default function DrawPanel({ back }: { back: () => void }): JSX.Element {
    const { t, i18n } = useTranslation();

    const { addDraw } = useContext(SubmitInfoContext);

    const canvasRef = useRef<CanvasDraw>(null);

    const [brushColor, setBrushColor] = useState("#000000");

    const [brushRadius, setBrushRadius] = useState(2);

    const props = {
        ...defaultProps,
        ref: canvasRef,
        brushColor,
        brushRadius,
        catenaryColor: brushColor,
        canvasWidth: screen.width,
        canvasHeight: (screen.height / 10) * 7,
    };

    const sliderLength = screen.width - 250;

    return (
        <div className="flex flex-col">
            <NavBar
                onBack={() => {
                    // setPanelAvailable(true);
                    canvasRef.current?.clear();
                    back();
                }}
                right={
                    <Button
                        type="primary"
                        icon={<CheckOutlined />}
                        onClick={() => {
                            addDraw(canvasRef.current);
                            canvasRef.current?.clear();
                            back();
                        }}
                    >
                        {t("confirmed")}
                    </Button>
                }
            >
                {t("drawing-board")}
            </NavBar>
            <CanvasDraw {...props} />
            <Space
                align="center"
                justify="around"
                style={{
                    width: "100%",
                }}
            >
                <Space align="center">
                    <Title
                        level={5}
                        style={{ margin: 0 }}
                    >
                        {t("label-brush-radius") + ": "}
                    </Title>
                    <Slider
                        min={1}
                        max={20}
                        onChange={(value) => {
                            setBrushRadius(value as number);
                        }}
                        style={{
                            width: `${sliderLength}px`,
                            // width: `${250}px`,
                            // width:
                        }}
                    />
                </Space>
                <ColorPicker
                    defaultValue={brushColor}
                    onChangeComplete={(value) => {
                        setBrushColor(value.toHexString());
                    }}
                />
                <Button
                    type="dashed"
                    icon={<RollbackOutlined />}
                    size="middle"
                    onClick={() => {
                        canvasRef.current?.undo();
                    }}
                />
            </Space>
        </div>
    );
}
