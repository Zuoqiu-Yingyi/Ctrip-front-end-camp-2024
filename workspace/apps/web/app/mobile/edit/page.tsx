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
"use client";
import React from "react";
import { NavBar, Button } from "antd-mobile";
import { CloseCircleFill, AddOutline } from "antd-mobile-icons";

export default function EditPage(): JSX.Element {
    return (
        <>
            <NavBar backArrow={<CloseCircleFill color="#CCCCCC" />} />
            <Button
                fill="none"
                style={{ width: 100, height: 100, backgroundColor: "#f7f7f7", marginLeft: 20 }}
            >
                <AddOutline color="#CCCCCC" fontSize={20} style={{fontWeight: "bold"}}/>
            </Button>
            <Button
                fill="none"
                style={{ width: 100, height: 100, backgroundColor: "#f7f7f7", fontWeight: 900 }}
            >
                <AddOutline color="#CCCCCC" fontSize={20}/>
            </Button>
        </>
    );
}
