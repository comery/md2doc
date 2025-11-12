# Markdown to Word Converter

一个基于 Streamlit 的自定义组件，提供“左侧 Markdown 编辑 + 右侧 Word 风格可编辑预览”的并排视图。支持字体、字号、颜色等样式配置，并通过组件在 Python 侧回传当前文本与配置。

## 功能特性
- 左侧 Markdown 编辑：支持从 `.md`、`.txt` 文件上传并载入内容。
- 右侧 Word 风格预览：提供加粗、斜体、下划线、标题、列表、字体与字号、文字颜色等工具栏，内容可编辑。
- Sidebar 配置：
  - 字体：英文与中文分别指定（默认英文 `Times New Roman`，中文 `微软雅黑`）。
  - 字号：`h1/h2/h3/body` 四档字号自定义。
  - 面板背景色：Markdown 面板与 Word 面板可分别设置背景色。
- Streamlit 集成：组件返回 `{ "markdown_text": str, "config": Dict }`，适合与后续导出、转换逻辑集成。
- 前端构建：使用 React + Vite，已适配在组件子路径下以相对路径加载静态资源。

## 项目结构
- `app.py`：Streamlit 应用入口，示例如何使用组件。
- `markdown_to_word/`：Python 包与组件声明。
  - `__init__.py`：
    - `_RELEASE=True`：读取打包静态资源目录 `frontend/dist`。
    - `_RELEASE=False`：使用开发模式 `url="http://localhost:5173"`。
    - 导出函数 `markdown_to_word_converter()` 用于渲染组件。
  - `frontend/`：组件前端源代码与构建配置、构建产物 `dist/`。
- 根目录前端文件（演示版）：`index.html`、`index.tsx`、`App.tsx`、`components/*`、`types.ts`、`vite.config.ts`、`tsconfig.json`。

## 安装与运行
- 本地直接运行（源码部署方式）：
  ```bash
  # 安装依赖并运行
  pip install -e .
  streamlit run app.py
  ```

- 以包形式安装（构建后部署）：
  ```bash
  # 使用 Poetry 构建
  poetry build
  # 在目标环境安装生成的包
  pip install dist/md2doc-*.whl
  streamlit run app.py
  ```

## 前端构建
- 组件前端位于 `markdown_to_word/frontend`：
  ```bash
  cd markdown_to_word/frontend
  npm ci
  npm run build
  ```
- 构建产物输出至 `markdown_to_word/frontend/dist/`，Python 组件在 `_RELEASE=True` 时会从该目录读取静态资源。
- Vite 配置 `base: './'`，确保云端部署时以相对路径加载静态资源。

## 在 Streamlit Cloud 部署
- 推荐流程（源码部署）：
  - 在本地执行前端构建并将 `markdown_to_word/frontend/dist/**` 提交到仓库。
  - 云端连接该仓库并部署 `app.py`。
- 或者使用包安装方式：
  - 在本地 `poetry build` 并发布构建产物。
  - 云端安装该包后运行 `app.py`。
- 若组件加载失败（黄色提示页或找不到目录），请确认：
  - 仓库是否包含 `markdown_to_word/frontend/dist`。
  - Python 包是否包含静态资源（本项目已在 `pyproject.toml` 配置 `include`）。

## 组件使用示例
```python
import streamlit as st
from markdown_to_word import markdown_to_word_converter

st.title("Markdown to Word Converter")

result = markdown_to_word_converter(
    markdown_text="# Hello\n\nType here...",
)

st.write("Current markdown:")
st.code(result["markdown_text"], language="markdown")
st.write("Current config:")
st.json(result["config"])
```

## 开发模式
- 将 `markdown_to_word/__init__.py` 中的 `_RELEASE` 改为 `False`，并启动前端开发服务器：
  ```bash
  cd markdown_to_word/frontend
  npm run dev
  ```
- 在开发模式下，组件从 `http://localhost:5173` 加载资源，适合快速迭代前端。

## 许可证
MIT
