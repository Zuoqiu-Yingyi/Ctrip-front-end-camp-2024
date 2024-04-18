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

// This file contains type definitions for data.
export type CardMessage = {
    type: "secondary" | "success" | "warning" | "danger";
    icon: React.ReactNode;
    text: string;
    numberName?: "success" | "fail" | "waiting" | "total";
    loading?: boolean;
    number?: number;
};

export type TravelNote = {
    id: number;
    href: string;
    title: string;
    content: string;
    image: string;
    state: "success" | "fail" | "waiting";
    isChecked: boolean;
    submissionTime: string;
    modificationTime: string;
    approvalTime: string;
    comment?: string;
    publishUId?: string
};

export type TimeMessage = {
    icon: React.ReactNode;
    text: string;
    time?: string;
    name?: string;
};

export type ManageData = {
    success: TravelNote[];
    waiting: TravelNote[];
    fail: TravelNote[];
};

export type ManagePage = {
    success: Set<number>;
    waiting: Set<number>;
    fail: Set<number>;
};

export type ManagePageNumber = {
    success: number;
    waiting: number;
    fail: number;
};
