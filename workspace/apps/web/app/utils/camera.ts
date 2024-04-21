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
export function openCamera(cameraVideoRef: React.RefObject<HTMLVideoElement>, cameraReviewRef: React.RefObject<HTMLCanvasElement>) {
    const opt = {
        audio: false,
        video: true,
    };

    navigator.mediaDevices
        .getUserMedia(opt)
        .then((mediaStream) => {
            displayVideo(cameraVideoRef, mediaStream);
        })
        .catch((err) => {
            console.error(`An error occurred: ${err}`);
        });

    const video = cameraVideoRef.current;
    const review = cameraReviewRef.current;
    const width = screen.width;

    if (video && review) {
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
                    review.setAttribute("width", `${width}`);
                    review.setAttribute("height", `${height}`);
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
    const video = cameraVideoRef.current;
    const stream = video?.srcObject;

    if (stream && "getTracks" in stream) {
        const tracks = stream.getTracks();

        tracks.forEach((track) => {
            track.stop();
        });

        video.srcObject = null;
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
export function displayVideo(cameraVideoRef: React.RefObject<HTMLVideoElement>, mediaStream: MediaStream) {
    const video = cameraVideoRef.current;

    if (video && "srcObject" in video) {
        video.srcObject = mediaStream;
        video.addEventListener("loadedmetadata", () => {
            video.play();
        });
    }
}

/**
 * 拍照并显示在画布上
 *
 * @remarks
 * This method is part of the {@link core-library#Statistics | Statistics subsystem}.
 *
 * @param cameraVideoRef - video标签的引用
 * @param cameraReviewRef - canvas标签的引用
 *
 * @returns 成功放回资源的base64URL，否则返回空字符串
 *
 * @beta
 */
export function getPicture(cameraVideoRef: React.RefObject<HTMLVideoElement>, cameraReviewRef: React.RefObject<HTMLCanvasElement>): string {
    const video = cameraVideoRef.current;
    const review = cameraReviewRef.current;

    if (!video || !review) {
        return "";
    }

    // console.log(review.width);
    // console.debug(video.videoWidth, video.videoHeight);

    const context = review.getContext("2d");

    let imgStr = "";

    if (context !== null) {
        context.drawImage(video, 0, 0, screen.width, height); // 把视频中的一帧在canvas画布里面绘制出来

        imgStr = review.toDataURL(); // 将图片资源转成字符串

        // closeCamera(cameraVideoRef); // 获取到图片之后可以自动关闭摄像头
    }

    return imgStr;
}
