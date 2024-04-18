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
    ErrorBlock,
    //
    Popup,
    Skeleton,
    Toast,
} from "antd-mobile";

import { ClientContext } from "@/contexts/client";
import { handleError, handleResponse } from "@/utils/message";
import { IReview } from "@/types/response";
import styles from "./page.module.scss";

/**
 * 用户更改密码弹出层
 * @param accountName 当前用户的账户名
 * @param visible 是否显示弹出层
 * @param onSuccess 更改密码成功的回调函数
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
            // TODO: 获取审核列表
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
                // TODO: 渲染审核列表
                <></>
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
