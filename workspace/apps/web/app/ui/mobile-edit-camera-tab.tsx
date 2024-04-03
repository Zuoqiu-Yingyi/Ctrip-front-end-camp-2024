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

import { Layout, FloatButton } from "antd";
import { CameraOutline, CheckOutline, CloseOutline } from "antd-mobile-icons";
import { useEffect, useRef, useState } from "react";
import { openCamera, getPicture } from "@/app/lib/utils";

export default function EditCameraTab(): JSX.Element {
    const cameraVideoRef = useRef<HTMLVideoElement>(null);

    const cameraCanvasRef = useRef<HTMLCanvasElement>(null);

    const [onVedio, setOnVedio] = useState<boolean>(true);

    useEffect(() => {
        console.log(screen.width);

        openCamera(cameraVideoRef, cameraCanvasRef);
    }, []);

    function takePicture() {
        getPicture(cameraVideoRef, cameraCanvasRef);
        setOnVedio(false);
    }

    return (
        <Layout style={{ flex: 1 }}>
            <video
                id="cameraVideo"
                ref={cameraVideoRef}
                // width="100%"
                style={{ display: onVedio ? "block" : "none" }}
            />
            <canvas
                id="cameraCanvas"
                ref={cameraCanvasRef}
                style={{ border: "1px solid black", display: !onVedio ? "block" : "none" }}
            />
            {/* {onVedio ? (
                <video
                    id="cameraVideo"
                    ref={cameraVideoRef}
                    width={320}
                    height={320}
                />
            ) : (
                <canvas
                    id="cameraCanvas"
                    ref={cameraCanvasRef}
                    // width={320}
                    // height={320}
                    style={{ border: "1px solid black", width: "100px", height: "100px" }}
                />
            )} */}

            {onVedio? 
            (
                <FloatButton
                    icon={<CameraOutline style={{ height: "30px", width: "30px", marginLeft: "-6" }} />}
                    style={{ right: "42%", bottom: "60px", height: "60px", width: "60px" }}
                    onClick={takePicture}
                />                
            ):(
                <>
                    <FloatButton
                        icon={<CheckOutline style={{ height: "30px", width: "30px", marginLeft: "-6" }} />}
                        style={{ right: "42%", bottom: "60px", height: "60px", width: "60px" }}
                    />
                    <FloatButton
                        icon={<CloseOutline style={{ height: "30px", width: "30px", marginLeft: "-6" }} />}
                        style={{ right: "25%", bottom: "60px", height: "60px", width: "60px" }}
                        onClick={() => {setOnVedio(true)}}
                    />                 
                </>
            )}



        </Layout>
    );
}