import os
from typing import Any, Dict, Optional

import streamlit.components.v1 as components
from streamlit.errors import StreamlitAPIException

# Set to False when developing the frontend locally (e.g., Vite dev server)
_RELEASE = True


def _declare_component():
    """Declare the Streamlit component, choosing dev server or built assets."""
    if not _RELEASE:
        # Adjust the URL to your local dev server if needed
        return components.declare_component(
            "markdown_to_word_converter", url="http://localhost:5173"
        )

    # In release mode, serve the built assets from the Python package
    parent_dir = os.path.dirname(os.path.abspath(__file__))
    build_dir = os.path.join(parent_dir, "frontend", "dist")
    if not os.path.isdir(build_dir):
        raise StreamlitAPIException(
            f"No such component directory: '{build_dir}'. Please build the frontend and commit 'markdown_to_word/frontend/dist' or include it in packaging."
        )
    return components.declare_component(
        "markdown_to_word_converter", path=build_dir
    )


_component = _declare_component()


DEFAULT_CONFIG: Dict[str, Any] = {
    "fontFamily": {
        "english": "Times New Roman, serif",
        "chinese": '"Microsoft YaHei", "微软雅黑", sans-serif',
    },
    "fontSize": {
        "h1": 32,
        "h2": 24,
        "h3": 20,
        "body": 16,
    },
    "colors": {
        "markdownBg": "#ffffff",
        "wordBg": "#ffffff",
    },
}


def markdown_to_word_converter(
    markdown_text: str = "",
    config: Optional[Dict[str, Any]] = None,
    key: Optional[str] = None,
) -> Dict[str, Any]:
    """Render the Markdown-to-Word editor component.

    Parameters
    - markdown_text: Initial markdown text to display in the editor.
    - config: Styling/config dictionary. If not provided, uses DEFAULT_CONFIG.
    - key: Optional Streamlit component key for state isolation.

    Returns a dict: { "markdown_text": str, "config": Dict }
    """
    cfg = config or DEFAULT_CONFIG

    # Provide a default value so the component returns synchronously on first render
    return _component(
        markdown_text=markdown_text,
        config=cfg,
        key=key,
        default={"markdown_text": markdown_text, "config": cfg},
    )
