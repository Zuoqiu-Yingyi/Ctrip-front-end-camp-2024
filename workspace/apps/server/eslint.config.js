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

import modules from "@repo/eslint-config/modules.js";

/**
 * @type {import("eslint").Linter.Config}
 * REF: https://eslint.nodejs.cn/docs/latest/
 */
const config = {
    ignores: [
        "./dist/**", //
        "./node_modules/**", //
        "./prisma/**", //
        "./temp/**", //
    ],
    files: [
        "**/*.js", //
        "**/*.ts", //
        "**/*.d.ts", //
    ],
    languageOptions: {
        parser: modules.ts_parser,
        parserOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
        },
    },
    plugins: {
        "eslint:recommended": modules.js_plugin,
        "@typescript-eslint": modules.ts_plugin,
    },
    // REF https://eslint.nodejs.cn/docs/latest/rules/
    rules: {},
    overrides: [
        {
            files: ["tests/**/*"],
            env: {
                jest: true,
            },
        },
    ],
};

export default [
    config, //
];
