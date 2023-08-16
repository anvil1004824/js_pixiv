import urllib.request
import sys
import os


def download(url,name,path):
    if not os.path.exists(f"image/{path}"):
        os.makedirs(f"image/{path}")
    if not os.path.exists(f"image/{path}/{name}.png"):
        opener=urllib.request.build_opener()
        opener.addheaders=[('Referer','https://app-api.pixiv.net/')]
        urllib.request.install_opener(opener)
        urllib.request.urlretrieve(url,f"image/{path}/{name}.png")
    print(f"{path} OK")

if __name__=="__main__":
    download(sys.argv[1],sys.argv[2],sys.argv[3])