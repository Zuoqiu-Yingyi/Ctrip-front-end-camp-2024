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
import { useContext, useEffect, useState } from "react";
import { Card, Typography, Col, Row } from "antd";
import { CheckCircleOutlined, ExclamationCircleOutlined, CloseCircleOutlined, MinusCircleOutlined } from "@ant-design/icons";
import { CardMessage, TravelNote } from "@/types/definitions";
import { fetchCardData } from "@/context/data";
import { AuthContext } from "@/context/authContext";
import { getReviewCount } from "@/utils/review";

const { Title } = Typography;

const CARD_MESSAGES: CardMessage[] = [
    {
        type: "success",
        icon: <CheckCircleOutlined className="mr-3" />,
        text: "已通过",
        numberName: "success",
    },
    {
        type: "danger",
        icon: <CloseCircleOutlined className="mr-3" />,
        text: "未通过",
        numberName: "fail",
    },
    {
        type: "warning",
        icon: <ExclamationCircleOutlined className="mr-3" />,
        text: "待审核",
        numberName: "waiting",
    },
    {
        type: "secondary",
        icon: <MinusCircleOutlined className="mr-3" />,
        text: "总数",
        numberName: "total",
    },
];

export default function CardWrapper(): JSX.Element {
    const { user } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);

    const [cardNumbers, setCardNumbers] = useState({
        success: 0,
        fail: 0,
        waiting: 0,
        total: 0,
    });

    useEffect(() => {
        (async () => {
            let temp = {
                success: 0,
                fail: 0,
                waiting: 0,
                total: 0,
            };

            await Promise.all(
                ["success" as TravelNote["state"], "fail" as TravelNote["state"], "waiting" as TravelNote["state"]].map((state) =>
                    getReviewCount(state, user.current).then((vaule) => {
                        temp[state] = vaule as number;

                        temp.total += vaule as number;
                    }),
                ),
            );
            setCardNumbers(temp);

            setLoading(false);
        })();
    }, []);

    return (
        <Row
            gutter={[32, 32]}
            style={{ flex: 1 }}
        >
            {CARD_MESSAGES.map((cardMessage, index) => (
                <Col
                    span={12}
                    key={`card_${index}`}
                >
                    <NumberCard
                        type={cardMessage.type}
                        icon={cardMessage.icon}
                        text={cardMessage.text}
                        number={cardNumbers[cardMessage.numberName || "fail"]}
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
            className="h-56"
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
