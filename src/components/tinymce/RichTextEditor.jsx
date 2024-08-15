import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import PropTypes from "prop-types";

const RichTextEditor = ({ value, onChange, onBlur }) => {
  const [loading, setLoading] = useState(true);
  const editorRef = useRef(null);

  const handleInit = (evt, editor) => {
    editorRef.current = editor;
    setLoading(false);
  };

  const handleEditorChange = (content, editor) => {
    if (onChange) {
      onChange(content);
    }
  };

  const handleBlur = () => {
    if (onBlur) {
      onBlur(editorRef.current.getContent());
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", height: "500px" }}>
      {loading && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center text-gray-500">
          <p>加载中...</p>
          {/* 你可以在这里放置加载动画 */}
        </div>
      )}
      <Editor
        apiKey="xxxxxxxxxxxx" //Replace with your apikey
        onInit={handleInit}
        value={value}
        init={{
          height: 500,
          menubar: false,
          language: "zh_CN",
          placeholder: "在这里输入文字",
          resize: "both",
          branding: false,
          font_formats:
            "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;",
          plugins:
            "print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media  code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount textpattern autosave emoticons",
          toolbar: [
            "fullscreen undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | bullist numlist | blockquote subscript superscript removeformat ",
            "styleselect formatselect fontselect fontsizeselect | table image axupimgs media emoticons charmap hr pagebreak insertdatetime selectall visualblocks searchreplace | code print preview | indent2em lineheight formatpainter",
          ],
          menu: {
            favs: {
              title: "My Favorites",
              items: "code visualaid | searchreplace | emoticons",
            },
          },
        }}
        onEditorChange={handleEditorChange}
        onBlur={handleBlur}
      />
    </div>
  );
};

RichTextEditor.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
};

export default RichTextEditor;
