import { DialogTitle } from "@radix-ui/react-dialog";
import { Dialog, DialogContent } from "../ui/dialog";
import { ImageIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import { usePostEditorModal } from "@/store/post-editor-modal";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useCreatePost } from "@/hooks/mutations/post/use-create-post";
import { toast } from "sonner";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { useSession } from "@/store/session";
import { useOpenAlertModal } from "@/store/alert-modal";
import { useUpdatePost } from "@/hooks/mutations/post/use-update-post";


type Image = {
    file : File,
    previewUrl: string
}

const handleSelectImages = (e: ChangeEvent<HTMLInputElement>) => {
  if (!e.target.files) return;

  const files = Array.from(e.target.files);

  files.forEach((file) => {
    // 1) 이미지 파일 검사
    if (!file.type.startsWith("image/")) {
      toast.error("이미지 파일만 업로드할 수 있습니다.", {
        position: "top-center",
      });
      return;
    }

    // 2) 프리뷰 URL 생성 후 상태에 저장
    const previewUrl = URL.createObjectURL(file);

    setImages((prev) => [
      ...prev,
      { file, previewUrl }
    ]);
  });

  // 선택 창 초기화 (같은 파일 다시 선택 가능)
  e.target.value = "";
};

const handleDeleteImage = (image: Image) => {
  setImages((prevImages: Image[]) =>
  prevImages.filter((item) => item.previewUrl !== image.previewUrl)
);

  // 메모리에서 프리뷰 URL 제거
  URL.revokeObjectURL(image.previewUrl);
};

export default function PostEditorModal(){
    const session = useSession();
    const postEditorModal = usePostEditorModal();

    const openAlertModal = useOpenAlertModal();

    const {mutate: createPost, isPending: isCreatePostPending} = useCreatePost({
        onSuccess:()=>{
            postEditorModal.actions.close();
        },
        onError:(error) =>{
            toast.error("포스트 생성에 실패했습니다",{
                position: "top-center",
            })
        }
    })

    const {mutate: updatePost, isPending: isUpdatePostPending} = useUpdatePost({
        onSuccess: () => {
            postEditorModal.actions.close();
        },
        onError:(error) => {
            toast.error("포스트 수정에 실패했습니다", {
                position: "top-center",
            })
        }
    })

    const [content,setContent] = useState("")
    const [images,setImages] = useState<Image[]>([]);


    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);


    useEffect(() =>{
        if(textareaRef.current){
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
        }
    },[content])

    useEffect(() =>{
            if(!postEditorModal.isOpen) {
                images.forEach((image) =>{
                    URL.revokeObjectURL(image.previewUrl);//메모리에서 제거
                });
                return;
            }

            if(postEditorModal.type === 'CREATE'){
                setContent("");
                setImages([]);
            }else{
                setContent(postEditorModal.content);
                setImages([]);
            }
            textareaRef.current?.focus();
            
    },[postEditorModal.isOpen]);


    const handleCloseModal = () => {
        if(content !== "" || images.length !== 0){
            openAlertModal({
                title: "게시글 작성이 마무리 되지 않았습니다.",
                description:"이 화면에서 나가면 작성중이던 내용이 사라집니다.",
                onPositive:()=>{
                    postEditorModal.actions.close();
                }
            })
            
            return;
        }
        postEditorModal.actions.close();
    };

    const handleSavePostClick = () =>{
    if(!postEditorModal.isOpen) return;

    // 글도 없고 이미지도 없으면 업로드 불가
    if (content.trim() === "" && images.length === 0) {
        toast.error("내용이나 이미지를 입력해주세요.", {
            position: "top-center",
        });
        return;
    }

    if(postEditorModal.type === 'CREATE'){
        createPost({
            content,
            images: images.map((image) => image.file),
            userId: session!.user.id
        });
    }else{
        // 수정 
        if(content === postEditorModal.content) return;
        updatePost({
            id : postEditorModal.postId,
            content : content,
        });
    }
};

    const handleSelectImages = (e:ChangeEvent<HTMLInputElement>) => {
        if(e.target.files){
            const files = Array.from(e.target.files);

            files.forEach((file) => {
                setImages((prev) => 
                    [...prev, 
                    {file,previewUrl: URL.createObjectURL(file) }
                ]);
            });
        }

        e.target.value = "";
    }

    const handleDeleteImage = (image:Image) =>{
        setImages((prevImages) => 
          prevImages.filter((item) => item.previewUrl !== image.previewUrl)
        );
        
        URL.revokeObjectURL(image.previewUrl);
    }

    const isPending = isCreatePostPending || isUpdatePostPending;
    
    return (
    <Dialog open={postEditorModal.isOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-h-[90vh">
            <DialogTitle>Moment 작성</DialogTitle>
            <textarea
            disabled={isPending} 
            ref={textareaRef}
            value={content}
            onChange={e => setContent(e.target.value)}
            className="max-h-125 min-h-25 focus:outline-none" 
            placeholder="무슨 일이 있었나요?" 
            />
            <input  
            onChange={handleSelectImages}
            ref={fileInputRef}
            type="file" accept="image/*" multiple className="hidden"
            />

             {postEditorModal.isOpen && postEditorModal.type === "EDIT" && (
                <Carousel>
                    <CarouselContent>
                        {postEditorModal.imageUrls?.map((url) => (
                        <CarouselItem className="basis-2/5" key={url}>
                            <div className="relative">
                                <img 
                                src={url}
                                className="h-full w-full rounded-sm object-cover"
                                />
                            </div>
                        </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
                )}

            {images.length > 0 && <Carousel>
                    <CarouselContent>
                        {images.map((image) =><CarouselItem className="basis-2/5" key={image.previewUrl}>
                            <div className="relative">
                                <img 
                                src={image.previewUrl}
                                className="h-full w-full rounded-sm object-cover"
                                />
                                <div onClick={() => handleDeleteImage(image)}className="absolute top-0 right-0 m-1 cursor-pointer rounded-full bg-black/30 p-1">
                                    <XIcon className="h-4 w-4 text-white"/>
                                </div>
                            </div>
                        </CarouselItem>)}
                    </CarouselContent>
                </Carousel>}
            {
            postEditorModal.isOpen && postEditorModal.type === 'CREATE' && (
            <Button 
            onClick={() => {
                    fileInputRef.current?.click();
                }}
            disabled={isPending}
            variant={'outline'} 
            className="cursor-pointer"
            >
            <ImageIcon />
                이미지 추가
            </Button>
            )}
            <Button 
            disabled={isPending}
            onClick={handleSavePostClick} 
            className="cursor-pointer"
            >
                저장
            </Button>
        </DialogContent>
    </Dialog>
    );
}

function setImages(arg0: (prev: any) => any[]) {
    throw new Error("Function not implemented.");
}
