import React, { useRef } from "react";
import { Editor } from "@tinymce/tinymce-react";
import PropTypes from "prop-types";

const RichTextEditor = ({ initialValue = "", onChange }) => {
  const editorRef = useRef(null);

  const handleEditorChange = (content, editor) => {
    if (onChange) {
      onChange(content);
    }
  };

  return (
    <Editor
      apiKey="gm0dm1aj4k8h0ulrbxec9975ep6y353lzzma5anb07nachy7" // 这里可以使用你的 TinyMCE API 密钥，或者不设置以使用社区版
      onInit={(evt, editor) => (editorRef.current = editor)}
      initialValue={initialValue}
      init={{
        height: 500,
        menubar: false,
        language: "zh_CN",
        placeholder: "在这里输入文字", //textarea中的提示信息
        resize: "both", //编辑器宽高是否可变，false-否,true-高可变，'both'-宽高均可，注意引号
        branding: false, //tiny技术支持信息是否显示
        // statusbar: false,  //最下方的元素路径和字数统计那一栏是否显示
        // elementpath: false, //元素路径是否显示
        font_formats:
        "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;", //字体样式
        plugins:
          "print preview searchreplace autolink directionality visualblocks visualchars fullscreen image link media template code codesample table charmap hr pagebreak nonbreaking anchor insertdatetime advlist lists wordcount textpattern autosave emoticons", //插件配置 axupimgs indent2em
        toolbar: [
          "fullscreen undo redo restoredraft | cut copy paste pastetext | forecolor backcolor bold italic underline strikethrough link anchor | alignleft aligncenter alignright alignjustify outdent indent | bullist numlist | blockquote subscript superscript removeformat ",
          "styleselect formatselect fontselect fontsizeselect |  table image axupimgs media emoticons charmap hr pagebreak insertdatetime  selectall visualblocks searchreplace | code print preview | indent2em lineheight formatpainter",
        ],
        menu: {
          favs: {
            title: "My Favorites",
            items: "code visualaid | searchreplace | emoticons",
          },
        },
      }}
      onEditorChange={handleEditorChange}
    />
  );
};

RichTextEditor.propTypes = {
  initialValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

export default RichTextEditor;
