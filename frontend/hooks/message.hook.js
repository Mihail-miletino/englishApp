export function useMessage(messages, mls = 100){
    function showMessage(index){
        if (index === messages.length){
            return;
        }
        setTimeout(() => {
            M.toast({
                html: messages[index]
            });
            showMessage(index + 1);
        }, mls);
    }
    showMessage(0);
}
