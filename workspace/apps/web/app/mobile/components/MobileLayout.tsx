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

import styles from "./MobileLayout.module.scss";

export function MobileApp({
    //
    children,
}: {
    children: React.ReactNode;
}): JSX.Element {
    return <div className={styles.app}>{children}</div>;
}

export function MobileHeader({
    //
    children,
}: {
    children: React.ReactNode;
}): JSX.Element {
    return <header className={styles.header}>{children}</header>;
}

export function MobileContent({
    //
    children,
}: {
    children: React.ReactNode;
}): JSX.Element {
    return <main className={styles.content}>{children}</main>;
}

export function MobileFooter({
    //
    children,
}: {
    children: React.ReactNode;
}): JSX.Element {
    return <footer className={styles.footer}>{children}</footer>;
}
