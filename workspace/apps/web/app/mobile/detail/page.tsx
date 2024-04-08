// Copyright 2024 lyt
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

// use client
'use client'
import React,{ createContext, useState,Fragment,useEffect} from 'react'
import { NavBar, Toast, Swiper, Avatar } from "antd-mobile";

import styles from './page.module.scss'

import imgURL from './IMG20180930172935.jpg';
import { Image } from 'antd-mobile'


const colors = ["#ace0ff", "#bcffbd", "#e4fabd", "#ffcfac"];
const items = colors.map((color, index) => (
    <Swiper.Item key={index}>
        <div
            className={styles.content}
            style={{ background: color }}
        >
            {index + 1}
        </div>
    </Swiper.Item>
));

const left = (
    <div className={styles.carduser}>
        <Avatar
            src=""
            style={{ "--size": "20px", "--border-radius": "50%" }}
            fallback={true}
        />
        <p className={styles.cardusername}>用户名</p>
    </div>
);
export default function HomePage() {

const back = () =>
    Toast.show({
        content: "点击了返回区域",
        duration: 1000,
    });


  return (
      <div style={{ width: "100%", margin: "0 auto", height: "100%" }}>
          <div className={styles.container1}>
              <NavBar
                  onBack={back}
                  left={left}
              ></NavBar>
          </div>
          <div className={styles.container2}>
              <Swiper className={styles.swiper}>{items}</Swiper>
          </div>
          <h4 className={styles.cardtitle}>标题</h4>
          <p>内容内容</p>
      </div>
  );
  
}
