import { staggerTransition } from '@/lib/framer-motion/stagger-transition';
import placeholder from '@/assets/images/placeholders/product.svg';
import { motion } from 'framer-motion';
import ProductDetailsPaper from '@/components/product/product-details-paper';
import ProductInformation from '@/components/product/product-information';
import ProductSocialShare from '@/components/product/product-social-share';
import ProductQuestions from '@/components/questions/product-questions';
import AverageRatings from '@/components/review/average-ratings';
import ProductReviews from '@/components/review/product-reviews';
import Image from '@/components/ui/image';
import { LongArrowIcon } from '@/components/icons/long-arrow-icon';
import routes from '@/config/routes';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import {
  fadeInBottom,
  fadeInBottomWithScaleX,
  fadeInBottomWithScaleY,
} from '@/lib/framer-motion/fade-in-bottom';
import { Product } from '@/types';
import { isEmpty } from 'lodash';

type SingleProps = {
  product: Product;
};

export function getPreviews(gallery: any[], image: any) {
  if (!isEmpty(gallery) && Array.isArray(gallery)) return gallery;
  if (!isEmpty(image)) return [image, {}];
  return [{}, {}];
}

const Single: React.FC<SingleProps> = ({ product }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const {
    id,
    name,
    slug,
    image,
    gallery,
    description,
    created_at,
    updated_at,
    ratings,
    rating_count,
    total_reviews,
    tags,
    type,
  } = product;
  const previews = getPreviews(gallery, image);
  return (
    <div className="relative">
      <div className="h-full min-h-screen p-4 md:px-6 lg:px-8 lg:pt-6">
        <div className="sticky top-0 z-20 flex items-center p-4 mb-1 -mx-4 -mt-2 bg-light-300 dark:bg-dark-100 sm:static sm:top-auto sm:z-0 sm:m-0 sm:mb-4 sm:bg-transparent sm:p-0 sm:dark:bg-transparent">
          <button
            onClick={() => router.push(routes?.home)}
            className="group inline-flex items-center gap-1.5 font-medium text-dark/70 hover:text-dark rtl:flex-row-reverse dark:text-light/70 hover:dark:text-light lg:mb-6"
          >
            <LongArrowIcon className="w-4 h-4" />
            {t('text-back')}
          </button>
        </div>
        <motion.div
          variants={staggerTransition()}
          className="grid gap-4 sm:grid-cols-2 lg:gap-6"
        >
          {previews?.map((img) => (
            <motion.div
              key={img.id}
              variants={fadeInBottomWithScaleX()}
              className="relative aspect-[3/2]"
            >
              <Image
                alt={name}
                fill
                quality={100}
                src={img?.original ?? placeholder}
                className="object-cover bg-light-500 dark:bg-dark-300"
              />
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          variants={fadeInBottom()}
          className="justify-center py-6 lg:flex lg:flex-col lg:py-10"
        >
          <ProductDetailsPaper product={product} className="lg:hidden" />
          <div className="lg:mx-auto 3xl:max-w-[1200px]">
            <div className="w-full rtl:space-x-reverse lg:flex lg:space-x-14 lg:pb-3 xl:space-x-20 3xl:space-x-28">
              <div className="hidden lg:block 3xl:max-w-[600px]">
                <div className="pb-5 leading-[1.9em] dark:text-light-600">
                  {description}
                </div>
                <ProductSocialShare
                  productSlug={slug}
                  className="pt-5 border-t border-light-500 dark:border-dark-400 md:pt-7"
                />
              </div>
              <ProductInformation
                tags={tags}
                created_at={created_at}
                updated_at={updated_at}
                layoutType={type.name}
                //@ts-ignore
                icon={type?.icon}
                className="flex-shrink-0 pb-6 pt-2.5 lg:min-w-[350px] lg:max-w-[470px] lg:pb-0"
              />
            </div>
            <div className="w-full mt-4 md:mt-8 md:space-y-10 lg:mt-12 lg:flex lg:flex-col lg:space-y-12">
              <AverageRatings
                ratingCount={rating_count}
                totalReviews={total_reviews}
                ratings={ratings}
              />
              <ProductReviews productId={id} />
              <ProductQuestions
                productId={product?.id}
                shopId={product?.shop?.id}
              />
            </div>
          </div>

          <ProductSocialShare
            productSlug={slug}
            className="pt-5 border-t border-light-500 dark:border-dark-400 md:pt-7 lg:hidden"
          />
        </motion.div>
      </div>
      <motion.div
        variants={fadeInBottomWithScaleY()}
        className="sticky bottom-0 right-0 z-10 hidden h-[100px] w-full border-t border-light-500 bg-light-100 px-8 py-5 dark:border-dark-400 dark:bg-dark-200 lg:flex 3xl:h-[120px]"
      >
        <ProductDetailsPaper product={product} />
      </motion.div>
    </div>
  );
};

export default Single;
