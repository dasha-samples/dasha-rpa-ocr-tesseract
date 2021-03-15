import "commonReactions/all.dsl";

context {
    input phone: string;
    isRefunding:boolean = false;
}

external function recognizeText(): string;

start node root
{
    do
    {
        #connectSafe($phone);
        #waitForSpeech(1000);
        #sayText("Welcome is Acme Utilities. How can I help you?");
        wait *;
    }
}

digression refund {
    conditions { on #messageHasIntent("refund") && !$isRefunding; }
    do {
            set $isRefunding = true;
            #sayText("Could you please show me your invoice?");
            wait *;
    }
    transitions {
        recognize: goto recognize on true;
    }
}

node recognize {
    do {
        #sayText("Okay, let me take a look...It will take a minute.");
        var text = external recognizeText();
        #say("reply", { amount: text });

        wait *;
    }
    transitions {
        transfer: goto transfer on true;
    }
}


node transfer {
    do {
        #sayText("All right the invoice has been refunded. Have a great day!");
    }
}