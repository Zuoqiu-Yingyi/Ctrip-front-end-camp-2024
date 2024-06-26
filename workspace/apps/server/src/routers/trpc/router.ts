/**
 * Copyright (C) 2024 Zuoqiu Yingyi
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

import { router } from ".";

import testRouter from "./test";
import authRouter from "./auth";
import accountRouter from "./account";
import draftRouter from "./draft";
import reviewRouter from "./review";
import publishRouter from "./publish";

// REF: https://trpc.io/docs/server/merging-routers#merging-with-child-routers
const trpcRouter = router({
    test: testRouter,
    auth: authRouter,
    account: accountRouter,
    draft: draftRouter,
    review: reviewRouter,
    publish: publishRouter,
});

export type TTrpcRouter = typeof trpcRouter;
export default trpcRouter;
