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
import { useEffect, useState } from "react";
import { Card, Typography, Col, Row } from "antd";
import { CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import { CardMessage } from "../lib/definitions";
import { fetchCardData } from "../lib/data";

const { Title } = Typography;

const CARD_MESSAGES: CardMessage[] = [
    {
        type: "success",
        icon: <CheckCircleOutlined className="mr-3" />,
        text: "已通过",
        numberName: "passNumber"
    },
    {
        type: "danger",
        icon: <CloseCircleOutlined className="mr-3" />,
        text: "未通过",
        numberName: "failNumber"
    },
    {
        type: "warning",
        icon: <ExclamationCircleOutlined className="mr-3" />,
        text: "待审核",
        numberName: "waitingNumber"
    },
    {
        type: "success",
        icon: <CheckCircleOutlined className="mr-3" />,
        text: "已通过",
        numberName: "waitingNumber"
    },
];

export default function CardWrapper(): JSX.Element {
    const [loading, setLoading] = useState(true);

    const [cardNumbers, setcardNumbers] = useState({
        passNumber: 0,
        failNumber: 0,
        waitingNumber: 0
    });

    useEffect(() => {
        (async () => {
            setcardNumbers(await fetchCardData());
            
            setLoading(false)
        })();
    }, []);

    return (
        <Row
            gutter={[32, 32]}
            style={{ flex: 1 }}
        >
            {CARD_MESSAGES.map((cardMessage) => (
                <Col span={12}>
                    <NumberCard
                        type={cardMessage.type}
                        icon={cardMessage.icon}
                        text={cardMessage.text}
                        number={cardNumbers[cardMessage.numberName || "failNumber"]}
                        loading={loading}
                    />
                </Col>
            ))}
        </Row>
    );
}

export function NumberCard({ type, icon, text, loading, number }: CardMessage): JSX.Element {
    return (
        <Card
            title={
                <Title
                    level={5}
                    type={type}
                    style={{ margin: 0 }}
                >
                    {icon}
                    {text}
                </Title>
            }
            loading={loading}
        >
            <Title
                className="text-center"
                level={2}
            >
                {number}
            </Title>
        </Card>
    );
}
