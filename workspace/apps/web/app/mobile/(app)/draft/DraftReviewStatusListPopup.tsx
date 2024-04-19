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

import {
    //
    useState,
    useEffect,
    useContext,
} from "react";
import { useTranslation } from "react-i18next";

import {
    Ellipsis,
    //
    ErrorBlock,
    List,
    Popup,
    Skeleton,
    Space,
    Tag,
} from "antd-mobile";
import {
    //
    EditFill,
    EyeOutline,
    UploadOutline,
} from "antd-mobile-icons";

import { ClientContext } from "@/contexts/client";
import {
    //
    handleError,
    handleResponse,
} from "@/utils/message";
import { IReview } from "@/types/response";
import { timestampFormat } from "@/utils/time";

import styles from "./page.module.scss";
import DraftStatusTag from "../../components/DraftStatusTag";

/**
 * 审核列表弹出层
 * @param visible 是否显示弹出层
 * @param onClose 弹出层关闭回调函数
 */
export function DraftReviewStatusListPopup({
    //
    id,
    visible,
    onClose,
}: {
    id: number;
    visible: boolean;
    onClose: () => any;
}): JSX.Element {
    const { t } = useTranslation();
    const { trpc } = useContext(ClientContext);

    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<IReview[]>([]);

    useEffect(() => {
        if (id) {
            query(id);
        } else {
            setData([]);
        }
    }, [id]);

    async function query(id: number) {
        // console.debug("query");
        setLoading(true);

        try {
            const response = await trpc.review.submitted.query({ draft_id: id });
            handleResponse(response);
            const reviews: IReview[] = (response.data?.reviews as any[]) ?? [];
            setData(reviews);
        } catch (error) {
            handleError(error);
        }

        setLoading(false);
    }

    return (
        <Popup
            visible={visible}
            showCloseButton={true}
            closeOnSwipe={true}
            bodyStyle={{
                borderTopLeftRadius: "8px",
                borderTopRightRadius: "8px",
            }}
            onClose={onClose}
            onMaskClick={onClose}
        >
            {loading ? (
                <>
                    <Skeleton.Title animated />
                    <Skeleton.Paragraph
                        lineCount={2}
                        animated
                    />
                </>
            ) : data.length > 0 ? (
                <List
                    className={styles.review_list}
                    header={t("labels.coordinate.title")}
                >
                    {data.map((review) => {
                        return (
                            <List.Item
                                title={
                                    <Space>
                                        <DraftStatusTag status={review.status} />
                                        {review.approval_time && (
                                            <Tag
                                                color="primary"
                                                fill="outline"
                                                aria-label={t("aria.approval-time")}
                                            >
                                                <EyeOutline />
                                                &thinsp;
                                                {timestampFormat(review.approval_time)}
                                            </Tag>
                                        )}
                                    </Space>
                                }
                                description={
                                    <Space>
                                        <Tag
                                            color="default"
                                            fill="outline"
                                            aria-label={t("aria.submission-time")}
                                        >
                                            <UploadOutline />
                                            &thinsp;
                                            {timestampFormat(review.submission_time)}
                                        </Tag>
                                        <Tag
                                            color="primary"
                                            fill="outline"
                                            aria-label={t("aria.modification-time")}
                                        >
                                            <EditFill />
                                            &thinsp;
                                            {timestampFormat(review.modification_time)}
                                        </Tag>
                                    </Space>
                                }
                            >
                                <Ellipsis
                                    direction="end"
                                    expandText={t("expand")}
                                    collapseText={t("collapse")}
                                    content={review.content}
                                />
                            </List.Item>
                        );
                    })}
                </List>
            ) : (
                <ErrorBlock
                    image="/icons/empty.svg"
                    title={t("status.draft-not-publish.description")}
                    description=""
                    style={{
                        padding: "2em",
                    }}
                />
            )}
        </Popup>
    );
}
export default DraftReviewStatusListPopup;
