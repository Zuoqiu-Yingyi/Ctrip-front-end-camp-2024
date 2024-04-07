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

import { useEffect, useState } from "react";
import i18next from "i18next";
import { UseTranslationOptions, initReactI18next, useTranslation as useTranslationOrg } from "react-i18next";
import { useCookies } from "react-cookie";
import resourcesToBackend from "i18next-resources-to-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { getOptions, languages, cookieName } from "./settings";

const runsOnServerSide = typeof window === "undefined";

//
i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(resourcesToBackend((language: string, namespace: string) => import(`./locales/${language}/${namespace}.json`)))
    .init({
        ...getOptions(),
        lng: undefined, // let detect the language on client side
        detection: {
            order: ["path", "htmlTag", "cookie", "navigator"],
        },
        preload: runsOnServerSide ? languages : [],
    });

export function useTranslation(lng: string, ns?: string, options?: UseTranslationOptions<undefined>) {
    const [cookies, setCookie] = useCookies([cookieName]);

    const ret = useTranslationOrg(ns, options);

    const { i18n } = ret;

    if (runsOnServerSide && lng && i18n.resolvedLanguage !== lng) {
        i18n.changeLanguage(lng);
    } else {
        const [activeLng, setActiveLng] = useState(i18n.resolvedLanguage);

        useEffect(() => {
            if (activeLng === i18n.resolvedLanguage) return;

            setActiveLng(i18n.resolvedLanguage);
        }, [activeLng, i18n.resolvedLanguage]);

        useEffect(() => {
            if (!lng || i18n.resolvedLanguage === lng) return;

            i18n.changeLanguage(lng);
        }, [lng, i18n]);

        useEffect(() => {
            if (cookies.i18next === lng) return;

            setCookie(cookieName, lng, { path: "/" });
        }, [lng, cookies.i18next]);
    }

    return ret;
}
