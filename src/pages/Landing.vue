<script lang="ts">
import { vMaska } from "maska/vue";
import { defineComponent, ref } from "vue";
import { useOrder } from "../composables/useOrder.ts";
import Loading from "../components/Loading.vue";
import { IOrder } from "../interfaces/order.interface.ts";
import DialogStatus from "../components/DialogStatus.vue";
import oneImg from "../assets/img/landing_top_one.png";
import twoImg from "../assets/img/landing_top_two.jfif";
import threeImg from "../assets/img/landing_top_three.png";
import fourImg from "../assets/img/landing_top_four.jfif";
export default defineComponent({
  components: { Loading, DialogStatus },
  props: {},
  setup() {
    const formRef = ref<HTMLFormElement | null>(null);
    const { createOrder } = useOrder();
    return { createOrder, formRef };
  },
  data() {
    return {
      oneImg,
      twoImg,
      threeImg,
      fourImg,
      selectedImg: { image: oneImg, selected: true },
      images: [
        { image: oneImg, selected: true },
        { image: twoImg, selected: false },
        { image: threeImg, selected: false },
        { image: fourImg, selected: false },
      ],
      formData: {
        firstName: "",
        lastName: "",
        street: "",
        postalCode: "",
        city: "",
        phone: "",
        email: "",
      },
      isStatusDialogVisible: false,
      statusSubtitle: "",
      statusContent: "",
      isStatusSuccess: false,
      isFormValid: false,
      isBtnLoading: false,
      isPageLoading: true,
      toastMessage: "",
      colorToast: "red-accent-2",
      showToast: false,
      rules: {
        required: (value: string) => !!value || "This field is required.",
        email: (value: string) => {
          const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          return pattern.test(value) || "Invalid e-mail.";
        },
        textLength: (value: string) => {
          const pattern = /^[A-Za-z0-9\s\W]{3,50}$/;
          return (
            pattern.test(value.trim()) ||
            "The input must be between 3 and 50 characters long."
          );
        },
        phoneLength: (value: string) => {
          const pattern = /^.{11}$/;
          return pattern.test(value) || "Invalid phone number.";
        },
        postalCodeLength: (value: string) => {
          const pattern = /^.{6}$/;
          return pattern.test(value) || "Invalid postal code.";
        },
        onlyLetters: (value: string) => {
          const pattern = /^[A-Za-zĄąĆćĘęŁłŃńÓóŚśŹźŻż\s]+$/;
          return pattern.test(value) || "This field can only contain letters.";
        },
      },
    };
  },
  computed: {
    filteredImages() {
      return this.images.filter((img) => !img.selected);
    },
  },
  methods: {
    handleSelect(imgSelected: any) {
      this.images.forEach((img) => {
        img.selected = false;
      });
      imgSelected.selected = true;
      this.selectedImg = imgSelected;
    },
    async handleFormSubmit() {
      if (!this.isFormValid) {
        this.createToast(
          "Some fields in the form are incorrect. Please review and correct them before submitting."
        );
        return;
      }
      this.isBtnLoading = true;
      await new Promise((resolve) => setTimeout(resolve, 2000)); // simulates api response waiting time
      const response = await this.processOrder(this.formData);
      if (!response) {
        this.createToast(
          "Oops! Something went wrong and we could not create your order. Please try again."
        );
        return;
      }
      this.formRef?.reset(); // clears form input fields
      this.createStatusDialog(
        "Your order has been successfully placed.",
        "Please check your email for the order confirmation and details. Thank you for shopping with us!",
        true
      );
    },
    async test() {},
    async processOrder(orderBody: IOrder) {
      this.isBtnLoading = true;
      try {
        const response: any = await this.createOrder(orderBody);
        if (!response) {
          return null;
        }
        return response;
      } catch (error) {
        console.log(error);
      } finally {
        this.isBtnLoading = false;
      }
    },
    createToast(message: string, type?: "success" | "error") {
      this.toastMessage = message;
      this.showToast = true;
      this.colorToast = type === "success" ? "#34d19a" : "red-accent-2";
    },
    createStatusDialog(subtitle: string, content: string, isSuccess: boolean) {
      this.statusSubtitle = subtitle;
      this.statusContent = content;
      this.isStatusSuccess = isSuccess;
      this.isStatusDialogVisible = true;
    },
    onCloseStatus() {
      this.isStatusDialogVisible = false;
    },
  },
  async mounted() {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // simulates waiting time for data to be fetched from an API
    this.isPageLoading = false;
  },
});
</script>

<template>
  <v-container fluid class="">
    <Loading :modelValue="isPageLoading" />
    <DialogStatus
      :subtitle="statusSubtitle"
      :content="statusContent"
      :isSuccess="isStatusSuccess"
      v-model="isStatusDialogVisible"
      @close="onCloseStatus"
    />
    <v-snackbar :timeout="5000" :color="colorToast" v-model="showToast">
      {{ toastMessage }}
      <template #actions>
        <v-btn color="white" variant="text" @click="showToast = false">
          x
        </v-btn>
      </template>
    </v-snackbar>
    <v-row id="top-section" justify="center">
      <v-col cols="auto" class="my-auto">
        <div class="h-[480px] relative">
          <v-img
            :src="selectedImg.image"
            eager
            min-width="480"
            max-width="480"
            min-height="480px"
            max-height="480px"
          ></v-img>
          <div
            class="absolute bg-greenMid rounded-full h-40 w-40 flex flex-col items-center justify-center space-y-2 top-[-15px] right-[-5px] shadow-2xl"
          >
            <div class="text-white text-4xl font-[700]">$1.99</div>
            <div class="text-white text-sm">Original value $500</div>
          </div>
        </div>
        <v-col class="flex pa-0 pt-2">
          <div v-for="img in filteredImages" class="w-full justify-center">
            <div class="h-36 mt-2">
              <div
                class="border-2 rounded-[26px] border-[#408a70] w-fit cursor-pointer"
                @click="handleSelect(img)"
              >
                <v-img
                  v-if="!img.selected"
                  width="132"
                  rounded="xl"
                  :src="img.image"
                />
              </div>
            </div>
          </div>
        </v-col>
      </v-col>
      <v-col cols="auto" class="overflow-hidden">
        <p class="text-[52px] font-[800] text-greenTxt leading-[55px]">
          Chance to win a StockX <br />Mystery Box today!
        </p>
        <p class="text-greenTxt text-[22px] mb-5 mt-1.5">
          Unleash the excitement of mystery Electronic
        </p>
        <v-card
          max-width="687"
          variant="outlined"
          rounded="xl"
          flat
          class="px-6"
          color="#dbdbdb"
        >
          <v-form v-model="isFormValid" ref="formRef" :disabled="isBtnLoading">
            <v-card-title class=""
              ><p class="flex justify-center text-[#2d473e] text-[30px] my-2.5">
                Enter details
              </p></v-card-title
            >
            <div class="w-[687px]"></div>
            <div class="flex space-x-4">
              <v-text-field
                v-model="formData.firstName"
                :rules="[rules.required, rules.onlyLetters, rules.textLength]"
                placeholder="First name"
                variant="outlined"
                rounded="lg"
                density="comfortable"
                required
                color="#2d473e"
                base-color="#a6acb0"
                class="w-1/2"
              />
              <v-text-field
                v-model="formData.lastName"
                :rules="[rules.required, rules.onlyLetters, rules.textLength]"
                placeholder="Last name"
                variant="outlined"
                rounded="lg"
                density="comfortable"
                required
                color="#2d473e"
                base-color="#a6acb0"
                class="w-1/2"
              />
            </div>
            <v-text-field
              v-model="formData.street"
              :rules="[rules.required, rules.textLength]"
              placeholder="Street"
              variant="outlined"
              rounded="lg"
              density="comfortable"
              required
              color="#2d473e"
              base-color="#a6acb0"
            />
            <div class="flex space-x-4">
              <v-text-field
                v-model="formData.postalCode"
                v-maska="'##-###'"
                :rules="[rules.required, rules.postalCodeLength]"
                placeholder="Postal code"
                variant="outlined"
                rounded="lg"
                density="comfortable"
                required
                color="#2d473e"
                base-color="#a6acb0"
                class="w-1/2"
              />
              <v-text-field
                v-model="formData.city"
                :rules="[rules.required, rules.onlyLetters, rules.textLength]"
                placeholder="City"
                variant="outlined"
                rounded="lg"
                density="comfortable"
                required
                color="#2d473e"
                base-color="#a6acb0"
                class="w-1/2"
              />
            </div>
            <v-text-field
              v-model="formData.phone"
              v-maska="'###-###-###'"
              :rules="[rules.required, rules.phoneLength]"
              placeholder="Phone number"
              variant="outlined"
              rounded="lg"
              density="comfortable"
              required
              color="#2d473e"
              base-color="#a6acb0"
            />
            <v-text-field
              v-model="formData.email"
              :rules="[rules.required, rules.email]"
              placeholder="E-mail"
              variant="outlined"
              rounded="lg"
              density="comfortable"
              required
              color="#2d473e"
              base-color="#a6acb0"
            />
            <v-btn
              class="w-full mt-0.5"
              color="#006340"
              size="large"
              text="Proceed to payment"
              rounded="lg"
              :loading="isBtnLoading"
              height="48"
              :disabled="!isFormValid"
              @click="handleFormSubmit"
            ></v-btn>
            <div class="flex my-6 justify-center">
              <div class="">
                <v-img
                  width="95px"
                  class=""
                  src="../src//assets//img/secure_mcaffe.png"
                  eager
                ></v-img>
              </div>
              <div class="">
                <v-img
                  width="95px"
                  class=""
                  src="../src//assets//img/secure_truste.png"
                  eager
                ></v-img>
              </div>
              <div class="">
                <v-img
                  width="95px"
                  class=""
                  src="../src//assets//img/secure_256bit.png"
                  eager
                ></v-img>
              </div>
            </div>
          </v-form>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center" class="">
      <v-col cols="12" class="text-center mb-1">
        <p class="text-5xl font-[600] text-[#2d473e]">
          Top Tech Mystery Box <br />
          at Unbeatable Prices
        </p>
        <p class="text-2xl font-[500] text-greenMid">
          Fast shipping | Easy returns | Special discounts for students
        </p>
      </v-col>
      <v-col cols="auto" class="">
        <v-img
          class=""
          rounded="xl"
          src="../src//assets//img/landing_mid_one.png"
          eager
          width="583"
        ></v-img>
      </v-col>
      <v-col cols="auto" class="my-auto">
        <p class="text-[40px] font-[600] text-greenTxt leading-tight">
          Curious about the <span class="text-greenMid">StockX</span
          ><br />Mystery Box?
        </p>
        <p
          class="text-greenTxt mb-2 mt-7 font-[400] text-balance max-w-[583px]"
        >
          Experience the thrill of unboxing cutting-edge gadgets with Stockx
          Mystery Boxes. <br />Each box is a treasure trove of high-quality
          electronics, handpicked to elevate your tech game.
        </p>
        <p class="text-greenTxt font-[400] text-balance max-w-[583px]">
          Expect the unexpected! Our boxes are packed with the latest gadgets,
          from smartphones to gaming consoles, ensuring you get the best tech
          surprises every <br />
          time.
        </p>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col cols="auto" class="my-auto">
        <p class="text-[40px] font-[600] text-greenTxt leading-tight">
          Why is everyone buzzing<br />about these boxes?
        </p>
        <p class="text-greenTxt mb-2 mt-7 font-[400] max-w-[583px]">
          StockX Mystery Boxes are not just about products; they're about the
          experience.<br />Imagine the excitement of unveiling top-tier
          electronics at a fraction of the cost.
        </p>
        <p class="text-greenTxt font-[400] max-w-[583px]">
          Our boxes include a variety of premium tech items, making it a
          must-have for every tech enthusiast. Join the buzz and see why
          everyone is raving about the unbeatable value and surprise factor of
          Stockx Mystery Boxes!
        </p>
      </v-col>
      <v-col cols="auto" class="">
        <v-img
          class=""
          rounded="xl"
          src="../src//assets//img/landing_mid_two.png"
          eager
          width="583"
        ></v-img>
      </v-col>
    </v-row>
    <!-- bottom section vvv -->
    <v-row class="bg-neutral-100 mt-11 px-2.5">
      <v-col cols="4">
        <v-card color="transparent" flat>
          <v-card-title class="py-1"
            ><span class="text-[14px] font-[500] text-greenTxt"
              >How can I win?</span
            ></v-card-title
          >
          <v-card-text class="">
            <p class="text-greenTxt text-[10.5px] tracking-tight font-[500]">
              Thanks to your membership, you also participate in our contest to
              win the iPhone15. We select a winner among every 600 participants.
              The next winner will be selected on 06.10.2023, and will be
              notified directly by e-mail. If the reward is out of stock, the
              winner will receive a similar product of equal or greater value
              instead.
            </p></v-card-text
          >
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card color="transparent" flat>
          <v-card-title class="py-1"
            ><span class="text-[14px] font-[600] text-greenTxt"
              >No hidden fees?</span
            ></v-card-title
          >
          <v-card-text class="">
            <p class="text-greenTxt text-[10.5px] tracking-tight font-[500]">
              We ensure that our members are provided with a detailed history of
              transactions so that they know exactly what they are paying for.
              Credit card information is only required to facilitate future
              purchases. There will be no charges on your credit card statement
              if you do not upgrade to PREMIUM membership and do not make a
              purchase.
            </p></v-card-text
          >
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card color="transparent" flat>
          <v-card-title class="py-1"
            ><span class="text-[14px] text-greenTxt font-[600]"
              >Why do we need your billing information?</span
            ></v-card-title
          >
          <v-card-text class="text-greenTxt text-[10.5px] tracking-tight">
            <p class="text-greenTxt text-[10.5px] tracking-tight font-[500]">
              By joining this service, you will receive a 5-day trial of our
              partner's program. If you continue with a subscription beyond the
              5-day trial period, you will be charged an amount on your credit
              card which varies depending on the choice of the tariff. When your
              contribution is deducted from your credit card or other payment
              method, you will have access to these services which are reserved
              exclusively for members of our partner's website.
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12"
        ><p class="text-center text-greenTxt text-xs mt-1 mb-0.5 font-[500]">
          We accept the follwoing credit cards
        </p>
        <v-img
          class="mx-auto mb-1"
          :width="400"
          cover
          src="../src//assets//img/cards-logos.png"
          eager
        ></v-img>
      </v-col>
    </v-row>
    <!-- bottom section ^^^ -->
  </v-container>
</template>

<style scoped>
:deep(.v-field__input) {
  font-size: 16px;
  color: #808080;
}
:deep(.v-field__input:focus) {
  color: #2d473e;
}
.v-img {
  pointer-events: none;
}
p,
.v-card {
  cursor: default;
}
/* .v-text-field :deep(.v-input__details) {
    padding-inline: 34.22px !important;
} */
</style>
