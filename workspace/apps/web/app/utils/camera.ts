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

let streaming = false;
let height = 0;

/**
 * 打开设备相机
 *
 * @remarks
 * This method is part of the {@link core-library#Statistics | Statistics subsystem}.
 *
 * @param cameraVideoRef - video标签的引用
 *
 * @beta
 */
export function openCamera(cameraVideoRef: React.RefObject<HTMLVideoElement>, cameraCanvasRef: React.RefObject<HTMLCanvasElement>) {
    const opt = {
        audio: false,
        video: true,
    };

    navigator.mediaDevices
        .getUserMedia(opt)
        .then((mediaStream) => {
            displayVedio(cameraVideoRef, mediaStream);
        })
        .catch((err) => {
            console.error(`An error occurred: ${err}`);
        });

    let video = cameraVideoRef.current as HTMLVideoElement;
    let canvas = cameraCanvasRef.current as HTMLCanvasElement;
    let width = screen.width;

    if (video !== null) {

        video.addEventListener(
            "canplay",
            () => {
                if (!streaming) {
                    height = video.videoHeight / (video.videoWidth / width);

                    // Firefox currently has a bug where the height can't be read from
                    // the video, so we will make assumptions if this happens.

                    if (isNaN(height)) {
                        height = width / (4 / 3);
                    }

                    video.setAttribute("width", `${width}`);
                    video.setAttribute("height", `${height}`);
                    canvas.setAttribute("width", `${width}`);
                    canvas.setAttribute("height", `${height}`);
                    streaming = true;
                }
            },
            false,
        );   

    }


}

/**
 * 关闭设备相机
 *
 * @remarks
 * This method is part of the {@link core-library#Statistics | Statistics subsystem}.
 *
 * cameraVideoRef - video标签的引用
 *
 * @beta
 */
export function closeCamera(cameraVideoRef: React.RefObject<HTMLVideoElement>) {
    const video = cameraVideoRef.current as HTMLVideoElement;

    const stream = video.srcObject as MediaStream;

    if ("getTracks" in stream) {
        const tracks = stream.getTracks();

        tracks.forEach((track) => {
            track.stop();
        });
    }
}

/**
 * 显示相机画面
 *
 * @remarks
 * This method is part of the {@link core-library#Statistics | Statistics subsystem}.
 *
 * @param cameraVideoRef - video标签的引用
 *
 * @beta
 */
export function displayVedio(cameraVideoRef: React.RefObject<HTMLVideoElement>, mediaStream: MediaStream) {
    const video = cameraVideoRef.current as HTMLVideoElement;

    if ("srcObject" in video) {
        video.srcObject = mediaStream;
    }

    video.onloadedmetadata = () => {
        video.play();
    };
}

/**
 * 拍照并显示在画布上
 *
 * @remarks
 * This method is part of the {@link core-library#Statistics | Statistics subsystem}.
 *
 * @param cameraVideoRef - video标签的引用
 * @param cameraCanvasRef - canvas标签的引用
 *
 * @returns 成功放回资源的base64URL，否则返回空字符串
 *
 * @beta
 */
export function getPicture(cameraVideoRef: React.RefObject<HTMLVideoElement>, cameraCanvasRef: React.RefObject<HTMLCanvasElement>): string {
    const video = cameraVideoRef.current as HTMLVideoElement;

    const canvas = cameraCanvasRef.current;

    if (canvas == null) {
        return "";
    }

    // console.log(canvas.width);
    console.log(video.videoWidth);
    console.log(video.videoHeight);

    const context = canvas.getContext("2d");

    let imgStr = "";

    if (context !== null) {
        context.drawImage(video, 0, 0, screen.width, height); // 把视频中的一帧在canvas画布里面绘制出来

        imgStr = canvas.toDataURL(); // 将图片资源转成字符串

        // closeCamera(cameraVideoRef); // 获取到图片之后可以自动关闭摄像头
    }

    return imgStr;
}
