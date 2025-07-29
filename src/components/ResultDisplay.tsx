"use client";

import { PetResult } from "@/app/page";

interface ResultDisplayProps {
  result: PetResult;
}

export default function ResultDisplay({ result }: ResultDisplayProps) {
  const confidenceColor =
    result.confidence > 0.8
      ? "text-green-600"
      : result.confidence > 0.6
      ? "text-yellow-600"
      : "text-red-600";

  // Get appropriate emoji and styling based on animal type
  const getAnimalEmoji = () => {
    switch (result.animal) {
      case "cat":
        return "🐱";
      case "dog":
        return "🐶";
      default:
        return "❓";
    }
  };

  const getAnimalColor = () => {
    switch (result.animal) {
      case "cat":
        return "from-pink-500 to-purple-600";
      case "dog":
        return "from-blue-500 to-indigo-600";
      default:
        return "from-gray-500 to-gray-600";
    }
  };

  const getAnimalName = () => {
    switch (result.animal) {
      case "cat":
        return "Kitty";
      case "dog":
        return "Doggy";
      default:
        return "Unknown Animal";
    }
  };

  // Handle unknown animals
  if (result.animal === "unknown") {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="text-6xl mb-4">🤔</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Hmm, that&apos;s not a cat or dog!
          </h2>
          <p className="text-lg text-gray-600 max-w-md mx-auto">
            Our AI couldn&apos;t identify this as a cat or dog. Try uploading a
            clearer photo of a cat 🐱 or dog 🐶!
          </p>
        </div>

        {result.description && (
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              What we see:
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {result.description}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="text-6xl mb-4">{getAnimalEmoji()}</div>
        <h2
          className={`text-3xl font-bold mb-2 bg-gradient-to-r ${getAnimalColor()} bg-clip-text text-transparent`}
        >
          Adorable {getAnimalName()} Identified!
        </h2>
        <p className="text-lg text-gray-600">
          Here&apos;s what we found about your furry friend! ✨
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Breed Information */}
        <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-xl p-6 border border-pink-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            {getAnimalEmoji()} Breed Information
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-600">
                Animal Type:
              </span>
              <p className="text-lg font-semibold text-gray-800 capitalize flex items-center gap-2">
                {result.animal} {getAnimalEmoji()}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-600">Breed:</span>
              <p className="text-lg font-semibold text-gray-800">
                {result.breed}
              </p>
            </div>
          </div>
        </div>

        {/* Confidence Score */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            📊 Confidence Score
          </h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-600">
                Accuracy:
              </span>
              <p className={`text-lg font-semibold ${confidenceColor}`}>
                {(result.confidence * 100).toFixed(1)}%
              </p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  result.confidence > 0.8
                    ? "bg-gradient-to-r from-green-400 to-green-600"
                    : result.confidence > 0.6
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-600"
                    : "bg-gradient-to-r from-red-400 to-red-600"
                }`}
                style={{ width: `${result.confidence * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-600">
              {result.confidence > 0.8
                ? "Very confident! 🎯"
                : result.confidence > 0.6
                ? "Pretty sure! 👍"
                : "Best guess 🤔"}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      {result.description && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
            📚 About This Breed
          </h3>
          <p className="text-gray-700 leading-relaxed">{result.description}</p>
        </div>
      )}

      {/* Cute Disclaimer */}
      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
        <div className="flex items-start gap-3">
          <div className="text-2xl">🤖</div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              AI-Powered Identification
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Our AI does its best to identify your furry friend, but remember -
              every pet is unique! For the most accurate breed information,
              consult with a veterinarian. This tool is designed for fun and
              educational purposes! 🎉
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
