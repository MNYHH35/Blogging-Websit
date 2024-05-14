const blogTitleField = document.querySelector('.title');
const articleFeild = document.querySelector('.article');

// banner
const bannerImage = document.querySelector('#banner-upload');
const banner = document.querySelector(".banner");
let bannerPath;

const publishBtn = document.querySelector('.publish-btn');
const uploadInput = document.querySelector('#image-upload');

bannerImage.addEventListener('change', () => {
    uploadImage(bannerImage, "banner");
})

uploadInput.addEventListener('change', () => {
    uploadImage(uploadInput, "image");
})

//在封面中上传图片
const uploadImage = (uploadFile, uploadType) => {
    // 从上传的文件列表中获取第一个文件
    const [file] = uploadFile.files;

    // 判断文件是否存在且为图片类型
    if(file && file.type.includes("image")){
        // 创建一个 FormData 对象
        const formdata = new FormData();
        // 将文件添加到 FormData 对象中
        formdata.append('image', file);

        // 发送 POST 请求到 '/upload' 接口
        fetch('/upload', {
            method: 'post',
            body: formdata
        // 解析返回的数据
        }).then(res => res.json())
        // 根据返回的数据进行处理
        .then(data => {
            // 如果上传类型为图片
            if(uploadType == "image"){
                // 调用 addImage 函数，传入返回的数据和文件名
                addImage(data, file.name);
            // 如果上传类型为其他类型
            } else{
                // 拼接图片的完整路径
                bannerPath = `${location.origin}/${data}`;
                // 设置 banner 的背景图片
                banner.style.backgroundImage = `url("${bannerPath}")`;
            }
        }).catch(error => {
            console.error('上传图片时发生错误:', error);
            alert('上传图片时发生错误，请稍后重试。');
        });
        
    // 如果文件不存在或不是图片类型
    } else{
        // 提示只能上传图片
        alert("upload Image only");
    }
}

//在内容中插入图片
const addImage = (imagepath, alt) => {
    // 获取当前光标位置
    let curPos = articleFeild.selectionStart;
    // 构造要插入的文本内容
    let textToInsert = `\r![${alt}](${imagepath})\r`;
    // 在光标位置插入文本内容
    articleFeild.value = articleFeild.value.slice(0, curPos) + textToInsert + articleFeild.value.slice(curPos);
    articleFeild.value.slice(curPos);

}

let months = ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"];

publishBtn.addEventListener('click', () => {
    if(articleFeild.value.length && blogTitleField.value.length){
        // generating id
        let letters = 'abcdefghijklmnopqrstuvwxyz';
        let blogTitle = blogTitleField.value.split(" ").join("-");
        let id = '';
        for(let i = 0; i < 4; i++){
            id += letters[Math.floor(Math.random() * letters.length)];
        }

        // setting up docName
        let docName = `${blogTitle}-${id}`;
        let date = new Date(); // for published at info

        //access firstore with db variable;
        db.collection("blogs").doc(docName).set({
            title: blogTitleField.value,
            article: articleFeild.value,
            bannerImage: bannerPath,
            publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
        })
        .then(() => {
            console.log("date entered");
            location.href = '/${docName}';
        })
        .catch((err) => {
            console.error(err);
        })
    }
})

