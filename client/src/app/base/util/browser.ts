import {HttpResponse} from "@angular/common/http";

export const downloadBlob = (response: HttpResponse<Blob>) => {
    if (!response.body) return;

    const blob = response.body;
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.setAttribute("style", "display: none");
    a.href = url;
    a.download = getName(response);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
};

const getName = (response: HttpResponse<unknown>) => {
    const contentDisposition = response.headers.get("content-disposition");
    if (!contentDisposition) return "unnamed";
    const name = contentDisposition.split("=")[1];
    return name.substring(1, name.length - 1);
};
