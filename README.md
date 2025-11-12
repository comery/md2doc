# Streamlit Markdown to Word Converter

A Streamlit component that provides a side-by-side view for editing Markdown and previewing it in a styled, editable, Word-like format.

## Installation

```bash
# From the root of this project directory
pip install .
```

## Usage

Create a file `app.py`:

```python
import streamlit as st
from markdown_to_word import markdown_to_word_converter

st.set_page_config(layout="wide")
st.title("Markdown to Word Converter")

# Initialize state
if 'markdown_text' not in st.session_state:
    st.session_state.markdown_text = """# Markdown to Word Converter

This is a demo of a real-time Markdown to Word converter running inside Streamlit.

## Features

- **Side-by-side view**: Edit Markdown on the left and see the styled, editable preview on the right.
- **Customizable Styles**: Use the sidebar to change fonts and font sizes for headings.
- **Editable Preview**: Fine-tune the output directly in the right panel using the editor toolbar.

### How to use

1.  Type or paste Markdown in this panel.
2.  Upload a `.md` file.
3.  Open the sidebar on the left to configure styles.
4.  Use the toolbar above the right panel to make final edits.
"""

if 'config' not in st.session_state:
    st.session_state.config = {
        "fontFamily": {
            "english": 'Times New Roman, serif',
            "chinese": '"Microsoft YaHei", "微软雅黑", sans-serif',
        },
        "fontSize": {
            "h1": 32,
            "h2": 24,
            "h3": 20,
            "body": 16,
        },
        "colors": {
            "markdownBg": '#ffffff',
            "wordBg": '#ffffff',
        },
    }

component_value = markdown_to_word_converter(
    markdown_text=st.session_state.markdown_text,
    config=st.session_state.config,
    key="md2word"
)

if component_value and (
    component_value["markdown_text"] != st.session_state.markdown_text or
    str(component_value["config"]) != str(st.session_state.config)
):
    st.session_state.markdown_text = component_value["markdown_text"]
    st.session_state.config = component_value["config"]
    st.rerun()
```

Then run it:
```bash
streamlit run app.py
```
