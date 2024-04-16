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

import { Modal, Form, Input } from "antd";
import { useTranslation } from "react-i18next";

const { TextArea } = Input;

export default function RejectModal({ isModalOpen, handleOk, handleCancel }: { isModalOpen: boolean; handleOk: any; handleCancel: any }): JSX.Element {
    const { t, i18n } = useTranslation();

    const [form] = Form.useForm();

    return (
        <Modal
            title={t("reject-reason")}
            open={isModalOpen}
            onOk={() => {
                handleOk(form.getFieldValue("reason"));
            }}
            onCancel={handleCancel}
            width={400}
            okText={t("confirmed")}
            cancelText={t("cancel")}
        >
            <Form
                labelCol={{ span: 4 }}
                wrapperCol={{ span: 24 }}
                layout="horizontal"
                style={{ maxWidth: 400 }}
                initialValues={{ operation: "pass" }}
                form={form}
            >
                <Form.Item name="reason">
                    <TextArea rows={5} />
                </Form.Item>
            </Form>
        </Modal>
    );
}
