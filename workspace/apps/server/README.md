# 服务端

## 开发者指南

### 初始化开发环境

1. 使用如下命令生成初始化开发环境

    ```shell
    $ pnpm start
    ```

    - 创建本地环境变量文件

        - `.env`: 所有环境的共享环境变量
        - `.env.development.local`: 开发环境的环境变量

            - 使用命令 `pnpm dev` 时自动加载

        - `.env.production.local`: 生产环境的环境变量

            - 使用命令 `pnpm prod` 时自动加载

        - `.env.test.local`: 测试环境的环境变量

            - 使用命令 `pnpm test` 时自动加载

        - 更多详情请参考 [Documentation | Dotenv](https://dotenvx.com/docs/) 与 [@dotenvx/dotenvx - npm](https://www.npmjs.com/package/@dotenvx/dotenvx)

    - 初始化 Prisma 客户端

        - 创建 sqlite3 数据库文件 `./data/travel-diary.db`
        - 构造 prisma 客户端 `./prisma/client/`
        - 生成 prisma 文档 `./prisma/docs/`

2. 使用如下命令启动开发服务

    ```shell
    $ pnpm dev
    ```

    - 启动开发服务后会自动启动一个开发用服务端

        - 每当 `./src/` 目录下的文件发生变更时会自动重启该服务端
