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

import { passphrase2key } from "@repo/utils/node/crypto";
import env from "./../configs/env";
import type { DatabaseClient } from "./client";

export interface IStaffInfo {
    role: number;
    username: string;
    passphrase: string;
    password: string;
}

/**
 * 账户字段转换为账户信息
 * @param account 账户字段
 * 格式: <用户名>:<口令>
 * @returns 密钥的 Hex 格式字符串
 */
export function account2info(account: string): IStaffInfo {
    const [role, username, passphrase] = account.split(":", 3);
    const password = passphrase2key(username, passphrase, env.USER_KEY_SALT).toString("hex");
    return {
        role: parseInt(role),
        username,
        passphrase,
        password,
    };
}

/**
 * 重置工作人员表
 */
export async function reset(this: InstanceType<typeof DatabaseClient>) {
    // REF: https://www.prisma.io/docs/orm/prisma-client/queries/crud#update-or-create-records
    await Promise.all(
        env.STAFF_ACCOUNTS.split("\n") //
            .map((account) => account.trim())
            .filter((account) => !!account)
            .map(account2info)
            .map((secret) =>
                this.p.staff.upsert({
                    where: {
                        name: secret.username,
                    },
                    update: {
                        password: secret.password,
                        role: secret.role,
                        token: {
                            update: {},
                        },
                    },
                    create: {
                        name: secret.username,
                        password: secret.password,
                        role: secret.role,
                        token: {
                            create: {},
                        },
                    },
                }),
            ),
    );
}
