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
import { Button,AutoCenter,InfiniteScroll } from 'antd-mobile'
import { SafeArea } from 'antd-mobile'
import { NavBar, Space, Toast,List,Card } from 'antd-mobile'
import { Badge, TabBar,DotLoading } from 'antd-mobile'
import { SearchOutline, MoreOutline, CloseOutline } from 'antd-mobile-icons'
import {
  AppOutline,
  MessageOutline,
  MessageFill,
  UnorderedListOutline,
  UserOutline,
} from 'antd-mobile-icons'
import styles from './page.module.scss'
import { mockRequest } from './mock-request'
import InfiniteScrollContent from './InfiniteScrollContent';


export default function HomePage() {
    const right = (
        <div style={{ fontSize: 24 }}>
            <Space style={{ '--gap': '16px' }}>
                <SearchOutline />
                <MoreOutline />
            </Space>
        </div>
    );

    const back = () =>
        Toast.show({
            content: '点击了返回区域',
            duration: 1000,
        });

    const tabs = [
        {
            key: 'home',
            title: '首页',
            icon: <AppOutline />,
            badge: Badge.dot,
        },
        {
            key: 'todo',
            title: '新建',
            icon: <UnorderedListOutline />,
            badge: '5',
        },
        {
            key: 'personalCenter',
            title: '我的',
            icon: <UserOutline />,
        },
    ];

    const [activeKey, setActiveKey] = useState('todo');
    const [hasMore, setHasMore] = useState(true)
    async function loadMore() {
        const append = await mockRequest()
        setHasMore(true)
    }
    const cards = [];
    let i = 0
    return (
        <>
            <SafeArea position='top' />
            <NavBar right={right} onBack={back} style={{ background: '#E4E1E0' }}>
                首页
            </NavBar>
            <div style={{ height: 570 }}>
                <div className={styles.container}>
                    <Card
                        headerStyle={{
                        color: '#1677ff',
                        height: '100px',
                        width: '100%'
                        }}
                        bodyClassName={styles.list}
                        title='卡片标题'
                    >
                        卡片内容
                    </Card >
                    <Card
                        headerStyle={{
                        color: '#1677ff',
                        height: '110px'
                        }}
                        bodyClassName={styles.list}
                        title='卡片标题'
                    >
                        卡片内容
                    </Card >
                    <Card
                        headerStyle={{
                        color: '#1677ff',
                        height: '120px'
                        }}
                        bodyClassName={styles.list}
                        title='卡片标题'
                    >
                        卡片内容
                    </Card >
                    <Card
                        headerStyle={{
                        color: '#1677ff',
                        height: '100px'
                        }}
                        bodyClassName={styles.list}
                        title='卡片标题'
                    >
                        卡片内容
                    </Card >
                    <Card
                        headerStyle={{
                        color: '#1677ff',
                        height: '100px'
                        }}
                        bodyClassName={styles.list}
                        title='卡片标题'
                    >
                        卡片内容
                    </Card >
                    <Card
                        headerStyle={{
                        color: '#1677ff',
                        height: '110px'
                        }}
                        bodyClassName={styles.list}
                        title='卡片标题'
                    >
                        卡片内容
                    </Card >
                    <Card
                        headerStyle={{
                        color: '#1677ff',
                        height: '130px'
                        }}
                        bodyClassName={styles.list}
                        title='卡片标题'
                    >
                        卡片内容
                    </Card >
                    <Card
                        headerStyle={{
                        color: '#1677ff',
                        height: '100px'
                        }}
                        bodyClassName={styles.list}
                        title='卡片标题'
                    >
                        卡片内容
                    </Card >
                    <Card
                        headerStyle={{
                        color: '#1677ff',
                        height: '120px'
                        }}
                        bodyClassName={styles.list}
                        title='卡片标题'
                    >
                        卡片内容
                    </Card >
                    <Card
                        headerStyle={{
                        color: '#1677ff',
                        height: '90px'
                        }}
                        bodyClassName={styles.list}
                        title='卡片标题'
                    >
                        卡片内容
                    </Card >
                    <Card
                        headerStyle={{
                        color: '#1677ff',
                        height: '110px'
                        }}
                        bodyClassName={styles.list}
                        title='卡片标题'
                    >
                        卡片内容
                    </Card >
                    <Card
                        headerStyle={{
                        color: '#1677ff',
                        height: '120px'
                        }}
                        bodyClassName={styles.list}
                        title='卡片标题'
                    >
                        卡片内容
                    </Card >
                    <Card
                        headerStyle={{
                        color: '#1677ff',
                        height: '100px'
                        }}
                        bodyClassName={styles.list}
                        title='卡片标题'
                    >
                        卡片内容
                    </Card >
                    <Card
                        headerStyle={{
                        color: '#1677ff',
                        height: '90px'
                        }}
                        bodyClassName={styles.list}
                        title='卡片标题'
                    >
                        卡片内容
                    </Card >
                    <Card
                        headerStyle={{
                        color: '#1677ff',
                        height: '120px'
                        }}
                        bodyClassName={styles.list}
                        title='卡片标题'
                    >
                        卡片内容
                    </Card >
                    <Card
                        headerStyle={{
                        color: '#1677ff',
                        height: '110px'
                        }}
                        bodyClassName={styles.list}
                        title='卡片标题'
                    >
                        卡片内容
                    </Card >
                    <Card
                        headerStyle={{
                        color: '#1677ff',
                        height: '130px'
                        }}
                        bodyClassName={styles.list}
                        title='卡片标题'
                    >
                        卡片内容
                    </Card >
                    <Card
                        headerStyle={{
                        color: '#1677ff',
                        height: '140px'
                        }}
                        bodyClassName={styles.list}
                        title='卡片标题'
                    >
                        卡片内容
                    </Card >
                    <Card
                        headerStyle={{
                        color: '#1677ff',
                        height: '120px'
                        }}
                        bodyClassName={styles.list}
                        title='卡片标题'
                    >
                        卡片内容
                    </Card >
                    <Card
                        headerStyle={{
                        color: '#1677ff',
                        height: '110px'
                        }}
                        bodyClassName={styles.list}
                        title='卡片标题'
                    >
                        卡片内容
                    </Card >
                    <Card
                        headerStyle={{
                        color: '#1677ff',
                        height: '100px'
                        }}
                        bodyClassName={styles.list}
                        title='卡片标题'
                    >
                        卡片内容
                    </Card >
                    <Card
                        headerStyle={{
                        color: '#1677ff',
                        height: '130px'
                        }}
                        bodyClassName={styles.list}
                        title='卡片标题'
                    >
                        卡片内容
                    </Card >
                    <Card
                        headerStyle={{
                        color: '#1677ff',
                        height: '90px'
                        }}
                        bodyClassName={styles.list}
                        title='卡片标题'
                    >
                        卡片内容
                    </Card >

                {/* <List>
                    {data.map((item, index) => (
                        <List.Item key={index}>{item}</List.Item>
                    ))}
                </List> */}
                <InfiniteScroll loadMore={loadMore} hasMore={hasMore}>
                    <InfiniteScrollContent hasMore={hasMore} loadMore={loadMore} />
                </InfiniteScroll>
                </div>
            </div>

            {/* <Space style = {styles.father}>
            <TabBar activeKey={activeKey} onChange={setActiveKey} className={"son"}>
                {tabs.map(item => (
                    <TabBar.Item key={item.key} icon={item.icon} title={item.title} />
                ))}
            </TabBar>
            </Space> */}
        </>
    );
}
