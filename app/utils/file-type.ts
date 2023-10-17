export default function fileTypeLanguage(fileName: string) {
    const ext = fileName.split('.').pop();
    switch (ext) {
        case 'css':
        case 'tsx':
        case 'ts':
        case 'jsx':
        case 'js': 
            return ext;
        case 'html':
            return "markup";
        default:
            return "plain";
    }
};