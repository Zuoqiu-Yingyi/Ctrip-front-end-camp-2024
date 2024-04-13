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
    comment?: string
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
