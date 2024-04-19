/**
 * Copyright (C) 2024 wu
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import {
    //

    useContext,
    useRef,
    useState,
} from "react";
import { useTranslation } from "react-i18next";
import CanvasDraw from "react-canvas-draw";
import {
    //
    ColorPicker,
    Button,
} from "antd";
import {
    //
    Slider,
    Space,
    NavBar,
} from "antd-mobile";
import {
    //
    RollbackOutlined,
    CheckOutlined,
} from "@ant-design/icons";

import { SubmitInfoContext } from "@/contexts/mobileEditContext";

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
    const { t } = useTranslation();

    const { addDraw } = useContext(SubmitInfoContext);

    const canvasRef = useRef<CanvasDraw>(null);

    const [brushColor, setBrushColor] = useState("#000000");

    const [brushRadius, setBrushRadius] = useState(1);

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
                        onClick={async () => {
                            if (canvasRef.current) {
                                await addDraw(canvasRef.current);
                                canvasRef.current.clear();
                            }
                            back();
                        }}
                    >
                        {t("confirmed")}
                    </Button>
                }
                style={{
                    borderBottom: "1px solid var(--adm-color-border)",
                }}
            >
                {t("drawing-board")}
            </NavBar>
            <CanvasDraw {...props} />
            <Space
                align="center"
                justify="around"
                style={{
                    width: "100%",
                    paddingTop: "2px",
                    borderTop: "1px solid var(--adm-color-border)",
                }}
            >
                <Space align="center">
                    <span style={{ fontSize: "125%" }}>{t("label-brush-radius") + ": "}</span>
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
