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

import { Layout, FloatButton } from "antd";
import { CameraOutline, CheckOutline, CloseOutline } from "antd-mobile-icons";
import { useContext, useEffect, useRef, useState } from "react";
import { openCamera, getPicture, closeCamera } from "@/utils/camera";
import { SubmitInfoContext } from "@/contexts/mobileEditContext";

export default function EditCameraTab(): JSX.Element {
    const { addPicture } = useContext(SubmitInfoContext);

    const cameraVideoRef = useRef<HTMLVideoElement>(null);

    const cameraCanvasRef = useRef<HTMLCanvasElement>(null);

    const [onVideo, setOnVideo] = useState<boolean>(true);

    useEffect(() => {
        openCamera(cameraVideoRef, cameraCanvasRef);
    }, []);

    function takePicture() {
        getPicture(cameraVideoRef, cameraCanvasRef);
        setOnVideo(false);
    }

    return (
        <Layout style={{ flex: 1 }}>
            <video
                id="cameraVideo"
                ref={cameraVideoRef}
                // width="100%"
                style={{ display: onVideo ? "block" : "none" }}
            />
            <canvas
                id="cameraCanvas"
                ref={cameraCanvasRef}
                style={{ border: "1px solid black", display: !onVideo ? "block" : "none" }}
            />
            {onVideo ? (
                <FloatButton
                    icon={<CameraOutline style={{ height: "30px", width: "30px", marginLeft: "-6" }} />}
                    style={{ right: "42%", bottom: "60px", height: "60px", width: "60px" }}
                    onClick={takePicture}
                />
            ) : (
                <>
                    <FloatButton
                        icon={<CheckOutline style={{ height: "30px", width: "30px", marginLeft: "-6" }} />}
                        style={{ right: "42%", bottom: "60px", height: "60px", width: "60px" }}
                        onClick={() => {
                            addPicture(cameraCanvasRef.current);
                            closeCamera(cameraVideoRef);
                        }}
                    />
                    <FloatButton
                        icon={<CloseOutline style={{ height: "30px", width: "30px", marginLeft: "-6" }} />}
                        style={{ right: "25%", bottom: "60px", height: "60px", width: "60px" }}
                        onClick={() => {
                            setOnVideo(true);
                        }}
                    />
                </>
            )}
        </Layout>
    );
}
