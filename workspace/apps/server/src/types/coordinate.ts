/**
 * Copyright (C) 2024 Zuoqiu Yingyi
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

import { z } from "zod";

/**
 * 维度
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GeolocationCoordinates/latitude GeolocationCoordinates: latitude property}
 */
export const COORDINATE_LATITUDE = z //
    .number({ description: "Latitude" })
    .min(-90)
    .max(90);

/**
 * 经度
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GeolocationCoordinates/longitude GeolocationCoordinates: longitude property}
 */
export const COORDINATE_LONGITUDE = z //
    .number({ description: "Longitude" })
    .min(-180)
    .max(180);

/**
 * 经纬度精度
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GeolocationCoordinates/accuracy GeolocationCoordinates: accuracy property}
 */
export const COORDINATE_ACCURACY = z //
    .number({ description: "Accuracy of latitude and longitude" })
    .min(0);

/**
 * 海拔高度
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GeolocationCoordinates/altitude GeolocationCoordinates: altitude property}
 */
export const COORDINATE_ALTITUDE = z //
    .number({ description: "Altitude" })
    .nullable();

/**
 * 海拔精读
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GeolocationCoordinates/altitudeAccuracy GeolocationCoordinates: altitudeAccuracy property}
 */
export const COORDINATE_ALTITUDE_ACCURACY = z //
    .number({ description: "Accuracy of altitude" })
    .nullable();

/**
 * 运动朝向方向
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GeolocationCoordinates/heading GeolocationCoordinates: heading property}
 */
export const COORDINATE_HEADING = z //
    .number({ description: "Heading" })
    .nullable();

/**
 * 运动速度
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/GeolocationCoordinates/speed GeolocationCoordinates: speed property}
 */
export const COORDINATE_SPEED = z //
    .number({ description: "Speed" })
    .nullable();

export const COORDINATE = z.object(
    {
        latitude: COORDINATE_LATITUDE,
        longitude: COORDINATE_LONGITUDE,
        accuracy: COORDINATE_ACCURACY,
        altitude: COORDINATE_ALTITUDE,
        altitude_accuracy: COORDINATE_ALTITUDE_ACCURACY,
        heading: COORDINATE_HEADING,
        speed: COORDINATE_SPEED,
    },
    { description: "Coordinate information" },
);
